/**
 * Tusk SDK - Data validation layer for Walrus
 * 
 * Features:
 * 1. Pre-upload validation (sniff)
 * 2. Post-upload verification (pierce)
 */

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import Ajv from 'ajv';
import { DEFAULT_PACKAGE_ID, DEFAULT_REGISTRY_ID, WALRUS_AGGREGATOR_URL } from './config';

export interface SchemaDefinition {
    name: string;
    version: string;
    schema: any;
}

/**
 * Main Tusk class for Walrus blob validation
 */
export class Tusk {
    private client: SuiClient;
    private packageId: string;
    private registryId: string;
    private ajv: Ajv;
    private walrusAggregatorUrl: string;

    constructor(
        network: 'testnet' | 'mainnet' | 'devnet' = 'testnet',
        packageId: string = DEFAULT_PACKAGE_ID,
        registryId: string = DEFAULT_REGISTRY_ID,
        walrusUrl?: string
    ) {
        // Initialize Sui client
        const rpcUrl = getFullnodeUrl(network);
        this.client = new SuiClient({ url: rpcUrl });
        this.packageId = packageId;
        this.registryId = registryId;
        this.walrusAggregatorUrl = walrusUrl || WALRUS_AGGREGATOR_URL;

        // Initialize AJV for JSON schema validation
        this.ajv = new Ajv({
            allErrors: true,
            verbose: true,
            strict: false
        });

        console.log(`🦦 Tusk initialized on ${network}`);
    }

    /**
     * Build transaction to register a new schema
     */
    buildRegisterSchemaTransaction(schemaDef: SchemaDefinition): Transaction {
        console.log(`\n📝 Building register schema transaction: ${schemaDef.name} v${schemaDef.version}`);

        const tx = new Transaction();
        const schemaContent = JSON.stringify(schemaDef.schema);

        tx.moveCall({
            target: `${this.packageId}::registry::register_schema`,
            arguments: [
                tx.object(this.registryId),
                tx.pure.string(schemaDef.name),
                tx.pure.string(schemaDef.version),
                tx.pure.string(schemaContent),
            ],
        });

        return tx;
    }

    /**
     * Pierce: Fetch blob, validate against schema, and return attestation tx
     */
    async pierce(
        blobId: string,
        schemaId: string
    ): Promise<{ isValid: boolean; attestationTx?: Transaction; errors?: any[] }> {
        console.log(`\n🎯 PIERCE: Starting validation workflow`);
        console.log(`   Blob ID: ${blobId}`);
        console.log(`   Schema ID: ${schemaId}`);

        try {
            // Step 1: Fetch schema from Sui
            console.log(`\n📋 Step 1/3: Fetching schema from Sui...`);
            const schemaObj = await this.client.getObject({
                id: schemaId,
                options: { showContent: true },
            });

            if (!schemaObj.data?.content) {
                throw new Error(`Schema object not found or empty: ${schemaId}`);
            }

            if (schemaObj.data.content.dataType !== 'moveObject') {
                throw new Error(`Invalid data type: ${schemaObj.data.content.dataType}`);
            }

            const schemaFields = schemaObj.data.content.fields as any;
            const schemaContentStr = schemaFields.schema_content;
            const schemaName = schemaFields.name;

            console.log(`   ✅ Schema found: ${schemaName}`);

            const schemaJson = JSON.parse(schemaContentStr);

            // Step 2: Fetch blob data from Walrus
            console.log(`\n🌊 Step 2/3: Fetching blob from Walrus Aggregator...`);
            const blobUrl = `${this.walrusAggregatorUrl}/blobs/${blobId}`;
            
            const response = await fetch(blobUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch blob: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            console.log(`   ✅ Blob fetched successfully`);

            // Step 3: Validate blob data against schema
            console.log(`\n✨ Step 3/3: Validating blob structure...`);
            const validate = this.ajv.compile(schemaJson);
            const isValid = validate(data);

            if (isValid) {
                console.log(`   ✅ VALIDATION PASSED!`);
                
                // Create attestation transaction
                const attestationTx = this.buildAttestTransaction(blobId, schemaId, true);
                return { isValid: true, attestationTx };
            } else {
                console.log(`   ❌ VALIDATION FAILED!`);
                return { isValid: false, errors: validate.errors || [] };
            }

        } catch (error: any) {
            console.error(`\n❌ Pierce failed:`, error.message);
            throw error;
        }
    }

    /**
     * Build transaction to attest a validated blob
     */
    buildAttestTransaction(
        blobId: string,
        schemaId: string,
        isValid: boolean = true
    ): Transaction {
        console.log(`\n🎖️  Building attestation transaction...`);

        const tx = new Transaction();

        tx.moveCall({
            target: `${this.packageId}::registry::create_attestation`,
            arguments: [
                tx.object(schemaId),
                tx.pure.string(blobId),
                tx.pure.bool(isValid),
            ],
        });

        return tx;
    }

    getClient(): SuiClient {
        return this.client;
    }

    getPackageId(): string {
        return this.packageId;
    }
}

export { DEFAULT_PACKAGE_ID, DEFAULT_REGISTRY_ID, WALRUS_AGGREGATOR_URL } from './config';

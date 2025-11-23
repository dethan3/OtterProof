/// Tusk Protocol - Schema Registry Module
/// Built by OtterLabs for the Walrus Hackathon
/// 
/// This module provides on-chain schema registration and attestation
/// capabilities for validating Walrus blob data structures.
module tusk::registry {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use std::string::{Self, String};

    // ========== Error Codes ==========
    const E_INVALID_SCHEMA: u64 = 1;
    const E_SCHEMA_NOT_FOUND: u64 = 2;
    const E_UNAUTHORIZED: u64 = 3;

    // ========== Data Structures ==========
    
    /// Schema: Represents a registered data schema
    /// OtterLabs: Schemas are SHARED OBJECTS so everyone can read and validate against them
    /// This creates a true "public registry" where schemas are universally accessible
    public struct Schema has key {
        id: UID,
        /// Name of the schema (e.g., "AI Dataset Schema")
        name: String,
        /// Schema version (e.g., "1.0")
        version: String,
        /// The actual JSON schema as a string
        schema_content: String,
        /// Address of the schema creator
        creator: address,
        /// Timestamp when schema was created
        created_at: u64,
    }

    /// Attestation: Represents a quality certificate for validated data
    /// This is minted when a Walrus blob is validated against a schema
    public struct Attestation has key, store {
        id: UID,
        /// Reference to the schema used for validation
        schema_id: ID,
        /// Walrus blob ID that was validated
        blob_id: String,
        /// Address that performed the attestation
        attester: address,
        /// Timestamp of attestation
        attested_at: u64,
        /// Whether the validation passed
        is_valid: bool,
    }

    /// SchemaRegistry: Singleton object that tracks all schemas
    /// OtterLabs: This acts as the central registry for all data schemas
    public struct SchemaRegistry has key {
        id: UID,
        /// Total number of schemas registered
        schema_count: u64,
    }

    // ========== Events ==========
    
    public struct SchemaRegistered has copy, drop {
        schema_id: ID,
        name: String,
        creator: address,
    }

    public struct AttestationCreated has copy, drop {
        attestation_id: ID,
        schema_id: ID,
        blob_id: String,
        attester: address,
        is_valid: bool,
    }

    /// Event emitted when the registry is created
    /// OtterLabs: Use this to find the registry ID after deployment
    public struct RegistryCreated has copy, drop {
        registry_id: ID,
    }

    // ========== Initialization ==========
    
    /// Initialize the schema registry
    /// Called once when the module is published
    /// OtterLabs: Emits RegistryCreated event to track the shared object ID
    fun init(ctx: &mut TxContext) {
        let registry = SchemaRegistry {
            id: object::new(ctx),
            schema_count: 0,
        };
        
        let registry_id = object::id(&registry);
        
        // Emit event so OtterLabs can find the registry ID
        event::emit(RegistryCreated {
            registry_id,
        });
        
        // Share the registry so anyone can read it
        transfer::share_object(registry);
    }

    // ========== Public Functions ==========
    
    /// Register a new schema on-chain
    /// OtterLabs: Schemas are shared publicly, creating a universal registry
    /// Anyone can read and validate against registered schemas
    /// 
    /// This is the foundation of Tusk's public data validation layer
    public entry fun register_schema(
        registry: &mut SchemaRegistry,
        name: vector<u8>,
        version: vector<u8>,
        schema_content: vector<u8>,
        ctx: &mut TxContext
    ) {
        let schema = Schema {
            id: object::new(ctx),
            name: string::utf8(name),
            version: string::utf8(version),
            schema_content: string::utf8(schema_content),
            creator: tx_context::sender(ctx),
            created_at: tx_context::epoch(ctx),
        };

        let schema_id = object::id(&schema);
        
        // Emit event
        event::emit(SchemaRegistered {
            schema_id,
            name: schema.name,
            creator: schema.creator,
        });

        // Increment counter
        registry.schema_count = registry.schema_count + 1;

        // Share the schema publicly - this is key for a public registry!
        // OtterLabs: Anyone can now read this schema for validation
        transfer::share_object(schema);
    }

    /// Create an attestation for a validated Walrus blob
    /// This mints a "Quality Certificate" on-chain
    /// 
    /// OtterLabs: After piercing through a Walrus blob and validating its structure,
    /// developers call this function to create an immutable proof of validation
    public entry fun create_attestation(
        schema: &Schema,
        blob_id: vector<u8>,
        is_valid: bool,
        ctx: &mut TxContext
    ) {
        let attestation = Attestation {
            id: object::new(ctx),
            schema_id: object::id(schema),
            blob_id: string::utf8(blob_id),
            attester: tx_context::sender(ctx),
            attested_at: tx_context::epoch(ctx),
            is_valid,
        };

        let attestation_id = object::id(&attestation);

        // Emit event
        event::emit(AttestationCreated {
            attestation_id,
            schema_id: attestation.schema_id,
            blob_id: attestation.blob_id,
            attester: attestation.attester,
            is_valid: attestation.is_valid,
        });

        // Transfer attestation to the attester
        transfer::public_transfer(attestation, tx_context::sender(ctx));
    }

    // ========== Getter Functions ==========
    
    /// Get schema details
    public fun get_schema_name(schema: &Schema): String {
        schema.name
    }

    public fun get_schema_version(schema: &Schema): String {
        schema.version
    }

    public fun get_schema_content(schema: &Schema): String {
        schema.schema_content
    }

    public fun get_schema_creator(schema: &Schema): address {
        schema.creator
    }

    /// Get attestation details
    public fun get_attestation_blob_id(attestation: &Attestation): String {
        attestation.blob_id
    }

    public fun get_attestation_validity(attestation: &Attestation): bool {
        attestation.is_valid
    }

    public fun get_attestation_schema_id(attestation: &Attestation): ID {
        attestation.schema_id
    }

    /// Get total schema count from registry
    public fun get_schema_count(registry: &SchemaRegistry): u64 {
        registry.schema_count
    }
}

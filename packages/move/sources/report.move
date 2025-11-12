module otterproof::report_registry {
    use std::option::{self, Option};
    use std::string::String;
    use std::vector;
    use sui::object::{self, UID};
    use sui::tx_context::{self, TxContext};

    struct DatasetRecord has store, drop {
        dataset_id: vector<u8>,
        schema_slug: String,
        walrus_link: vector<u8>,
        uploader: address,
    }

    struct ValidationReport has store, drop {
        dataset: DatasetRecord,
        score: u64,
        passed: bool,
        walrus_reference: Option<String>,
        summary_hash: vector<u8>,
        epoch_recorded: u64,
    }

    public struct ReportRegistry has key {
        id: UID,
        reports: vector<ValidationReport>,
    }

    public fun init(ctx: &mut TxContext): ReportRegistry {
        ReportRegistry { id: object::new(ctx), reports: vector::empty<ValidationReport>() }
    }

    public fun new_dataset_record(dataset_id: vector<u8>, schema_slug: String, walrus_link: vector<u8>, ctx: &TxContext): DatasetRecord {
        DatasetRecord {
            dataset_id,
            schema_slug,
            walrus_link,
            uploader: tx_context::sender(ctx),
        }
    }

    public entry fun submit_report(
        registry: &mut ReportRegistry,
        dataset: DatasetRecord,
        score: u64,
        walrus_reference: Option<String>,
        summary_hash: vector<u8>,
        ctx: &TxContext,
    ) {
        let report = ValidationReport {
            dataset,
            score,
            passed: score >= 80,
            walrus_reference,
            summary_hash,
            epoch_recorded: tx_context::epoch(ctx),
        };
        vector::push_back(&mut registry.reports, report);
    }
}

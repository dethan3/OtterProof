module otterproof::schema_registry {
    use std::string::String;
    use std::vector;
    use sui::object::{self, UID};
    use sui::tx_context::{self, TxContext};

    const E_TOO_MANY_FIELDS: u64 = 1;

    struct FieldRule has store, drop {
        name: String,
        data_type: String,
        is_required: bool,
    }

    struct SchemaTemplate has store, drop {
        slug: String,
        version: u64,
        fields: vector<FieldRule>,
        owner: address,
    }

    public struct SchemaRegistry has key {
        id: UID,
        templates: vector<SchemaTemplate>,
    }

    public fun init(ctx: &mut TxContext): SchemaRegistry {
        SchemaRegistry { id: object::new(ctx), templates: vector::empty<SchemaTemplate>() }
    }

    public entry fun register_schema(
        registry: &mut SchemaRegistry,
        slug: String,
        version: u64,
        field_rules: vector<FieldRule>,
        ctx: &TxContext,
    ) {
        assert!(vector::length(&field_rules) <= 32, E_TOO_MANY_FIELDS);

        let template = SchemaTemplate {
            slug,
            version,
            fields: field_rules,
            owner: tx_context::sender(ctx),
        };
        vector::push_back(&mut registry.templates, template);
    }

    public fun new_field_rule(name: String, data_type: String, is_required: bool): FieldRule {
        FieldRule { name, data_type, is_required }
    }
}

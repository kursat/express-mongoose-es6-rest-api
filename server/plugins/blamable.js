export default function blamable(schema) {
    schema.add({
        updatedBy: {
            type: String,
        },
        createdBy: {
            type: String,
        },
    });

    // eslint-disable-next-line no-param-reassign
    schema.methods.blamableSave = function blamableSave(savedBy, cb) {
        if (this.isNew) {
            this.createdBy = savedBy;
            this.updatedBy = savedBy;
        } else {
            this.updatedBy = savedBy;
        }

        return this.save(cb);
    };
}

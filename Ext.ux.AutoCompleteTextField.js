Ext.define('Ext.ux.AutoCompleteTextField', {
    extend: 'Ext.Container',
    xtype: 'autocompletetextfield',

    config: {
        value: null,
        textfield: {},
        selectfield: {
            margin: '-10 0 0 0'
        },
        minCharsForRequest: 3,
        serverFilterParam: null,
        clientFilterField: null
    },
    publishes: 'value',
    defaultBindProperty: 'value',

    layout: 'vbox',
    items: [
        {
            itemId: 'textfieldContainer'
        }, {
            itemId: 'selectfieldContainer',
            style: 'visibility:hidden'
        }
    ],

    applyTextfield(config) {
        return Ext.factory(config, Ext.field.Text, this.getTextfield());
    },

    updateTextfield(tf) {
        if (tf) {
            tf.on('change', this.onTextfieldChange, this, {buffer: 700});
        }
        this.down('#textfieldContainer').setItems(tf);
    },

    applySelectfield(config) {
        return Ext.factory(config, Ext.field.Select, this.getSelectfield());
    },

    updateSelectfield(sf) {
        if (sf) {
            sf.on('select', this.onSelectfieldChange, this);
        }
        this.down('#selectfieldContainer').setItems(sf);
    },

    updateClientFilterField(field) {
        if (Ext.isString(field)) {
            this.getSelectfield()
                .getStore()
                .filterBy(record => {
                    let recordValue = record.get(field);
                    if (recordValue) {
                        // case-insensitive match
                        recordValue = recordValue.toLowerCase();
                        const textFieldValue = String(this.getTextfield().getValue() || "").toLowerCase();
                        return recordValue.indexOf(textFieldValue) !== -1;
                    }
                    return false;
                });
        }
    },

    onTextfieldChange(select, value) {
        const sf = this.getSelectfield();

        // reset selectfield
        sf.setValue(null);

        if (!value) {
            // field has been cleared
            this.setValue(undefined);
            return;
        }

        if (value && String(value).length >= this.getMinCharsForRequest()) {
            // load store
            const params = {};
            if (Ext.isString(this.getServerFilterParam())) {
                params[this.getServerFilterParam()] = value;
            }
            sf.suspendEvents();
            sf.getStore().load({
                scope: this,
                params: params,
                callback(records, operation, success) {
                    sf.resumeEvents();
                    if (success) {
                        sf.showPicker();
                    }
                }
            });
        } else {
            sf.getStore().removeAll();
        }
    },

    onSelectfieldChange(select, record) {
        const tf = this.getTextfield();
        tf.suspendEvents();
        tf.setDisabled(true);

        // update texfield value
        const value = record.get(select.getDisplayField());
        tf.setValue(value);

        // update bind
        this.setValue(value);

        tf.setDisabled(false);
        tf.resumeEvents();
    }

});
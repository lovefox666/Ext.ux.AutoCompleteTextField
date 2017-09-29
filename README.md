# Ext.ux.AutoCompleteTextField
ExtJS 6.5 modern autocomplete textfield

##Demo

Demo avaiable here https://fiddle.sencha.com/#view/editor&fiddle/27iv

##Usage

    {
        xtype: 'autocompletetextfield',
        clientFilterField: 'name',
        bind: '{myVar}',
        textfield: {
            label: 'my label'
        },
        selectfield: {
            valueField: 'id',
            displayField: 'name',
            store: {
                ...                
            }
        }
    }
    
##Available configs

Config | Desc
------------ | -------------
textfield | Ext.field.Text configs
selectfield | Ext.field.Select configs
minCharsForRequest | minimum number of chars required to trigger select load
serverFilterParam | name of the filter param in http GET request (server side filter)
clientFilterField | name of the field used to filter results in selectfield store (client side filter)
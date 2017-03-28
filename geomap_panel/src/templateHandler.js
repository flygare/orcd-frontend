/** This class will be responsible for handling template variables */
export default class TemplateHandler {
    /**
    * Build the template handler and set some initiate variables
    */
    constructor (ctrl, templateSrv, variableSrv) {
        this.ctrl = ctrl;
        this.templateSrv = templateSrv;
        this.variableSrv = variableSrv;
    }

    /**
    * Add a new variable to the variable service
    *
    * @param {string} type - The variable type (Interval, Query, Custom etc.)
    * @param {string} name - The name of the variable
    * @param {string} label - A more descriptive name for the variable
    * @param {array} options - An array of options (see the option builder function)
    * @param {object} current - The currently selected option(s) (see the current builder)
    * @param {string} query - The query this template will produce
    * @param {bool} multi - If multiple options can be selected
    */
    addVariable (type, name, label, options, current, query, multi) {
        if (this.variableExists(name)) return;

        this.variableSrv.addVariable({
            type: type,
            name: name,
            label: label,
            options: options,
            current: current,
            query: query,
            multi: multi
        });

        this.variableUpdated();
    }

    /**
    * Updated a variable in the variable service
    *
    * @param {string} variableName - The name of the variable to be updated
    * @param {array} options - An array of options (see the option builder function)
    * @param {string} query - The query this template will produce
    * @param {string} currentText - The text of the currently selected object
    * @param {array} currentValue - The currently selected option(s)
    */
    updateVariable (variableName, options, query, currentText, currentValue) {
        if (!this.variableExists(variableName)) return;

        var variable = this.variableSrv.variables[this.getVariableIndexByName(variableName)];
        variable.options = options;
        variable.query = query;
        variable.current.text = currentText;
        variable.current.value = currentValue;

        this.variableUpdated();
    }

    /**
    * Delete a variable
    *
    * @param {string} name - The name of the variable to be deleted
    */
    deleteVariable (name) {
        var variableIndex = this.getVariableIndexByName(name);

        if (variableIndex !== -1) {
            this.variableSrv.variables.splice(variableIndex, 1);
        }

        this.variableUpdated();
    }

    /**
    * This should be called when an object has been added, updated or deleted in order to broadcast the alteration
    */
    variableUpdated () {
        this.variableSrv.$rootScope.$emit('template-variable-value-updated');
        this.variableSrv.$rootScope.$broadcast('refresh');
        this.templateSrv.init(this.variableSrv.variables);
    }

    /**
    * Get the index of a variable by name
    *
    * @param {string} name - The name of the variable to be found
    * @return {int} - The index of the variable (-1 if not present)
    */
    getVariableIndexByName (name) {
        if (this.variableSrv.variables) {
            for (var i = 0; i < this.variableSrv.variables.length; i++) {
                if (this.variableSrv.variables[i].name === name) {
                    return i;
                }
            }
        }

        return -1;
    }

    /**
    * Check if a variable exists
    *
    * @param {string} name - The name of the variable
    */
    variableExists (name) {
        return this.getVariableIndexByName(name) !== -1;
    }

    /**
    * Get a built current object, formated properly
    *
    * @param {string} text - The text of the current variable
    * @param {array} value - An array of options (see build option)
    * @return {object} - The correctly built current object
    */
    buildCurrent (text, value) {
        return {'text': text, 'value': value};
    }

    /**
    * Get a built option object, formatted proerply
    *
    * @param {string} text - The visible name of the option
    * @param {string} value - The value of the option
    * @param {bool} selected - If the option is selected or not
    * @return {object} - The correctly built option object
    */
    buildOption (text, value, selected) {
        return {'text': text, 'value': value, 'selected': selected};
    }

    /**
    * Build an array of options
    *
    * @param {array} options - An array of options ({text, value, selected} (see build option))
    * @return {array} - An array of options
    */
    buildOptions (options) {
        var res = [];

        for (var key in options) {
            res.push(this.buildOption(options[key].text, options[key].value, options[key].selected));
        }

        return res;
    }
}
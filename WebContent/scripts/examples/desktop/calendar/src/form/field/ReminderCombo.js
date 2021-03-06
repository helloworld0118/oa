/**
 * @class Ext.calendar.form.field.ReminderCombo
 * @extends Ext.form.ComboBox
 * <p>A custom combo used for choosing a reminder setting for an event.</p>
 * <p>This is pretty much a standard combo that is simply pre-configured for the options needed by the
 * calendar components. The default configs are as follows:<pre><code>
    width: 200,
    fieldLabel: 'Reminder',
    queryMode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'desc',
    valueField: 'value'
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.form.field.ReminderCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.reminderfield',

    fieldLabel: '提醒时间',
    queryMode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'desc',
    valueField: 'value',

    // private
    initComponent: function() {
        this.store = this.store || new Ext.data.ArrayStore({
            fields: ['value', 'desc'],
            idIndex: 0,
            data: [
            ['', '不提醒'],
            ['0', '正点提醒'],
            ['5', '提前5分钟'],
            ['15', '提前15分钟'],
            ['30', '提前30分钟'],
            ['60', '提前60分钟'],
            ['90', '提前90分钟'],
            ['120', '提前2个小时'],
            ['180', '提前3个小时'],
            ['360', '提前6个小时'],
            ['720', '提前12个小时'],
            ['1440', '提前1天'],
            ['2880', '提前2天'],
            ['4320', '提前3天'],
            ['5760', '提前4天'],
            ['7200', '提前5天'],
            ['10080', '提前1周'],
            ['20160', '提前2周']
            ]
        });

        this.callParent();
    },

    // inherited docs
    initValue: function() {
        if (this.value !== undefined) {
            this.setValue(this.value);
        }
        else {
            this.setValue('');
        }
        this.originalValue = this.getValue();
    }
});

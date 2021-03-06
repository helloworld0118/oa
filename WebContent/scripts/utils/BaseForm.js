Ext.define('BaseForm', {
			extend : 'Ext.form.Panel',
			bodyPadding : 5,
			layout : 'anchor',
			frame:true,
			defaults : {
				anchor : '100%',
				msgTarget: 'side'
			},
			margin : '0 2 2 2',
			defaultType : 'textfield'
		});

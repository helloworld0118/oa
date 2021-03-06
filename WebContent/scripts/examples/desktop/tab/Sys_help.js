Ext.define('Sys_help', {
			extend : 'Ext.window.Window',
			border : false,
			draggable : true,
			closable : true,
			modal : true,
			resizable : false,
			width : 400,
			height : 300,
			title : '帮助与关于',
			iconCls : 'help',
			id : 'sys_help',
			closable : true,
			layout : 'fit',
			tbar:[{
			   html:'<img src="images/office/brid.gif">',
			   height:50
			}],
			items : [{
						xtype : 'tabpanel',
						padding:'10 10 10 10',
						items : [{
									title:'关于',
									listeners : {
										afterrender : function(panel) {
											tpl = Ext.create('Ext.XTemplate',
											        '<center><p style="margin-top:40px;">便捷OA欢迎您的使用！</p>',
													'<p>Copyright &copy 1992-2012 深蓝  </p></center>');
											tpl.overwrite(panel.body);		
											panel.doComponentLayout();
										}
									}
								},{
									title:'帮助',
									html:'<center><h1>暂无</h1></center>'
								}]
					}],
			buttonAlign : 'center',
			buttons : [{
						text : '确定',
						handler : function() {
							this.ownerCt.ownerCt.close();
						}
					}]
		})

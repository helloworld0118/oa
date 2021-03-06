Ext.onReady(function() {
	Ext.define('quickRemind', {
				extend : 'Ext.data.Model',
				fields : [{
							name : 'text'
						}, {
							name : 'count'
						}]
			});
	var remindQuickStore = Ext.create('Ext.data.Store', {
				model : 'quickRemind',
				proxy : {
					type : 'ajax',
					url : '../../../remind/remind!getQuickRemind',
					reader : {
						type : 'json'
					}
				}
			})
	var win = Ext.create('Ext.window.Window', {
				title : '快捷提示',
				height : 180,
				width : 300,
				closable : false,
				resizable : false,
				renderTo : Ext.getBody(),
				listeners : {
					render : function(p) {
						p.getEl().on("contextmenu", function(e) {
									e.preventDefault();
								})
					}
				},
				layout : 'fit',
				items : [{
					xtype : 'grid',
					store : remindQuickStore,
					loadMask : {
						msg : '正在加载数据,请稍等......'
					},
					forceFit : true,
					frame : true,
					multiSelect : true,
					columns : [{
								header : '事件',
								dataIndex : 'text'
							}, {
								header : '提醒',
								dataIndex : 'count',
								renderer : function(v) {
									if (v > 0) {
										return "<span style='color:red'>" + v
												+ "</span>"
									} else {
										return "<span style='color:green'>" + v
												+ "</span>";
									}
								}
							}]
				}]
			});
	// 快捷提醒
	Ext.create('Ext.util.KeyMap', Ext.getBody(), [{
				key : Ext.EventObject.Q, // E for east
				shift : false,
				ctrl : true,
				fn : function() {
					if (!win.hidden) {
						win.hide();
					} else {
						remindQuickStore.load();
						Ext.Ajax.request({
									url : '../../../process/task!getWaitCount',
									success : function(res) {
										var count=res.responseText;
										remindQuickStore.add({text:'我的待办',count:count});
										win.show();
									}
								});
						
						
					}
				}

			}]

	);
})
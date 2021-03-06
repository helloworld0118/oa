Ext.define('Communication', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'name'
					}, {
						name : 'sex'
					}, {
						name : 'qq'
					}, {
						name : 'tel'
					}, {
						name : 'address'
					}, {
						name : 'des'
					}, {
						name : 'school'
					}, {
						name : 'record'
					}, {
						name : 'birth'
					}, {
						name : 'userId'
					}, {
						name : 'idCard'
					}]
		});
Ext.define('publicCommInfo', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'id'
					}, {
						name : 'departName'
					}, {
						name : 'position'
					}, {
						name : 'roleName'
					}, {
						name : 'userState'
					}, {
						name : 'userRecord'
					}, {
						name : 'userName'
					}, {
						name : 'password'
					}, {
						name : 'userSex'
					}, {
						name : 'userQq'
					}, {
						name : 'userTel'
					}, {
						name : 'userAddress'
					}, {
						name : 'userDes'
					}, {
						name : 'userSchool'
					}, {
						name : 'userBirth'
					}, {
						name : 'userIdcard'
					}, {
						name : 'userImg'
					}]
		});
// CommPublic store
var CommPublicStore = Ext.create('Ext.data.Store', {
			model : 'publicCommInfo',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../comm/comm!publicInfo'
				},
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
// CommPrivate store
var CommPrivateStore = Ext.create('Ext.data.Store', {
			model : 'Communication',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../comm/comm!privateInfo'
				},
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				}
			}
		});
// 头部
Ext.define('CommTopPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.commTopPanel',
	id : 'commTopPanel',
	layout : 'column',
	items : [{
		xtype : 'toolbar',
		columnWidth : .7,
		height : 100,
		html : "<div style='width:100% height:100%;'><div style='float:left;background:url(images/office/brid.gif); height:100px; width:400px;'></div> <div style='float:right;id='search''></div></div>"

	}, {
		xtype : 'form',
		columnWidth : .3,
		height : 100,
		frame : true,
		layout : 'anchor',
		padding:'50 0 5 100',
		html:'<span style="color:green">人的能力是有限的，而人的努力是无限的</span>'
	}]
});
// 左侧的菜单栏
Ext.define('CommBar', {
	extend : 'Ext.panel.Panel',
	frame : true,
	alias : 'widget.commBar',
	defaults : {
		bodyStyle : 'padding:15px'
	},
	layoutConfig : {
		titleCollapse : false,
		animate : true,
		activeOnTop : true
	},
	items : [{
				xtype : 'image',
				layout : 'fit',
				width : 180,
				height : 180,
				src : '../../../comm/comm!getCurrentUserPic',
				listeners : {}
			}, {
				xtype : 'panel',
				frame : true,
				border : false,
				defaultType : 'button',
				layout : 'column',
				defaults : {
					columnWidth : 1
				},
				items : [{
					margin : '0 0 0 0',
					iconCls : '',
					text : '公共通讯录',
					handler : function() {
						var tabpanel = Ext.getCmp('commMain');
						var voteIng = tabpanel.getComponent('comm_publicPanel');
						if (!voteIng) {
							voteIng = tabpanel.add({
										title : '公共通讯录',
										iconCls : '',// TODO
										// 样式没有加
										id : 'comm_publicPanel',
										xtype : 'comm_publicPanel',
										closable : true
									});
						}
						tabpanel.setActiveTab(voteIng);

					}
				}, {
					margin : '5 0 0 0',
					iconCls : '',
					text : '私人通讯录',
					handler : function() {
						var tabpanel = Ext.getCmp('commMain');
						var voteEd = tabpanel.getComponent('comm_privatePanel');
						if (!voteEd) {
							voteEd = tabpanel.add({
										title : '私人通讯录',
										iconCls : '',// TODO
										// 样式没有加
										id : 'comm_privatePanel',
										xtype : 'comm_privatePanel',
										closable : true
									});
						}
						tabpanel.setActiveTab(voteEd);
					}
				}]
			}]

});
var comm_refresh = function(store) {
	store.load();
}
// Comm_privatextype
Ext.define('Comm_privatePanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.comm_privatePanel',
	id : 'comm_privatePanel',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			CommPrivateStore.load();
		},
		render : function(p) {
			p.getEl().on("contextmenu", function(e) {
						e.preventDefault();
					})
		}
	},
	items : [{
		xtype : 'grid',
		forceFit : true,
		height : 400,
		frame : true,
		id : 'comm_privatePanel_grid',
		store : CommPrivateStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : CommPrivateStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '增加',
					handler : function() {
						Ext.create('comm_EditWindow', {
									title : '增加'
								}).show();
					}
				}, '-', {
					iconCls : 'delte0',
					text : '删除',
					handler : function() {
						comm_delete();
					}
				}, '-', {
					iconCls : 'tabel_edit',
					text : '修改',
					handler : function() {
						comm_edit();
					}
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : function() {
						comm_refresh(CommPrivateStore);
					}
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '姓名',
					xtype : 'searchfield',
					store : CommPrivateStore
				}, '-', {
					xtype : 'splitbutton',
					text : '',
					iconCls : 'help',
					menu : [{
								text : '图文帮助',
								iconCls : 'help_img',
								handler : function() {
									findFailShow('commMain', 'help_img');
								}

							}, {
								text : '视频帮助',
								iconCls : 'help_video',
								handler : function() {
									findFailShow('commMain', 'help_video');
								}
							}]
				}],
		columns : [{
					header : '姓名',
					dataIndex : 'name'
				}, {
					header : '性别',
					dataIndex : 'sex',
					renderer : function(v) {
						if (v == 1 || v == '1') {
							return "<span style='color:red'>女</span>"
						} else {
							return "男"
						}
					}
				}, {
					header : 'QQ',
					dataIndex : 'qq'
				}, {
					header : '电话',
					dataIndex : 'tel'
				}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
			},
			itemdblclick : function(view, record, item, index, e, eOpts) {
				commPrivateDetail(record);
			}
		}
	}]
});
// Comm_Publicxtype
Ext.define('Comm_publicPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.comm_publicPanel',
	id : 'comm_publicPanel',
	layout : 'fit',
	listeners : {
		afterrender : function() {
			CommPublicStore.load();
		},
		render : function(p) {
			p.getEl().on("contextmenu", function(e) {
						e.preventDefault();
					})
		}
	},
	items : [{
		xtype : 'grid',
		forceFit : true,
		height : 400,
		frame : true,
		id : 'comm_publicPanel_grid',
		store : CommPublicStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : CommPublicStore,
			dock : 'bottom',
			displayInfo : true,
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : function() {
						comm_refresh(CommPublicStore);
					}
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '姓名',
					xtype : 'searchfield',
					store : CommPublicStore
				}, '-', {
					xtype : 'splitbutton',
					text : '',
					iconCls : 'help',
					menu : [{
								text : '图文帮助',
								iconCls : 'help_img',
								handler : function() {
									findFailShow('commMain', 'help_img');
								}
							}, {
								text : '视频帮助',
								iconCls : 'help_video',
								handler : function() {
									findFailShow('commMain', 'help_video');
								}
							}]
				}],
		columns : [{
					header : '编号',
					dataIndex : 'id'
				}, {
					header : '姓名',
					dataIndex : 'userName'
				}, {
					header : '性别',
					dataIndex : 'userSex',
					renderer : function(v) {
						if (v == 0) {
							return '男'
						} else {
							return "<span style='color:red'>女</span>"
						}
					}
				}, {
					header : '所属部门',
					dataIndex : 'departName'
				}, {
					header : '职位',
					dataIndex : 'position'
				}, {
					header : '角色',
					dataIndex : 'roleName'
				}, {
					header : '状态',
					dataIndex : 'userState',
					renderer : function(v) {
						if (v == '离职 ' || v == '请假' || v == '外出' || v == '出差') {
							return "<span style='color:red'>" + v + "</span>"
						} else {
							return v;
						}
					}
				}],
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
			},
			itemdblclick : function(view, record, item, index, e, eOpts) {
				commPublicDetail(record);
			}
		}
	}]
});
// 删除
var comm_delete = function() {
	var grid = Ext.getCmp('comm_privatePanel_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.hasSelection()) {
		var select = selModel.getSelection();
		Ext.Array.each(select, function(item) {
					Ext.Ajax.request({
								url : '../../../comm/comm!deletePri',
								params : {
									'id' : item.data.id
								},
								success : function(res) {
								},
								failure : function(res) {
								}
							})
				})
		CommPrivateStore.load();
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
	}
}
// 修改
var comm_edit = function() {
	var grid = Ext.getCmp('comm_privatePanel_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.getSelection().length == 1) {
		var window = Ext.create('comm_EditWindow', {
					title : '修改'
				}).show();
		var select = selModel.getSelection();
		Ext.getCmp('comm_edit_form').getForm().loadRecord(select[0]);
		if (select[0].data.sex) {
			Ext.getCmp('comm_sexRadioWoMan').setValue(true);
		} else {
			Ext.getCmp('comm_sexRadioMan').setValue(true);
		}
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
	}
}
// 增加，修改Window
Ext.define('comm_EditWindow', {
	extend : 'Ext.window.Window',
	width : 500,
	title : '',
	id : 'comm_edit',
	frame : true,
	border : false,
	draggable : true,
	closable : true,
	modal : true,
	resizable : false,
	items : [{
		xtype : 'form',
		// bodyPadding : 5,
		id : 'comm_edit_form',
		layout : 'column',
		frame : true,
		defaults : {
			columnWidth : 1,
			msgTarget : 'side',
			xtype : 'textfield'
		},
		padding : '5 0 5 10',
		items : [{
					xtype : 'hiddenfield',
					name : 'id'
				}, {
					fieldLabel : '姓名',
					name : 'name',
					labelWidth : 40,
					margin : '5 0 0 0',
					allowBlank : false,
					afterLabelTextTpl : required,
					columnWidth : 1
				}, {
					xtype : 'label',
					text : '性别：',
					labelWidth : 40,
					columnWidth : .1,
					margin : '5 0 0 0'
				}, {
					xtype : 'radio',
					boxLabel : '男',
					name : 'sex',
					id : 'comm_sexRadioMan',
					checked : true,
					inputValue : 0,
					margin : '5 0 0 10',
					columnWidth : .2
				}, {
					xtype : 'radio',
					boxLabel : '女',
					name : 'sex',
					id : 'comm_sexRadioWoMan',
					inputValue : 1,
					margin : '5 0 0 5',
					columnWidth : .2
				}, {
					xtype : 'datefield',
					fieldLabel : '出生日期',
					format : 'Y-m-d',
					labelWidth : 60,
					margin : '5 0 0 5',
					name : 'birth',
					columnWidth : .5
				}, {
					fieldLabel : '手机',
					name : 'tel',
					margin : '5 0 0 0',
					labelWidth : 40,
					regex : /^[0-9]{11}$/,
					regexText : '请输入11位数字',
					columnWidth : .5
				}, {
					fieldLabel : 'QQ',
					name : 'qq',
					margin : '5 0 0 33',
					labelWidth : 30,
					regex : /^[0-9]*$/,
					regexText : '请输入数字',
					columnWidth : .5
				}, {
					fieldLabel : '学历',
					name : 'record',
					margin : '5 0 0 0',
					regex : /^[\u4e00-\u9fa5\w,.!""，。！“”]*$/,
					regexText : '请输入中英文或基本符号（,.!）',
					labelWidth : 40,
					columnWidth : .5
				}, {
					fieldLabel : '身份证',
					name : 'idCard',
					margin : '5 0 0 17',
					regex : /^[\u4e00-\u9fa5\w,.!""，。！“”]*$/,
					regexText : '请输入中英文或基本符号（,.!）',
					labelWidth : 45,
					columnWidth : .5
				}, {
					fieldLabel : '学校',
					name : 'school',
					margin : '5 0 0 0',
					regex : /^[\u4e00-\u9fa5\w,.!""，。！“”]*$/,
					regexText : '请输入中英文或基本符号（,.!）',
					labelWidth : 40
				}, {
					fieldLabel : '地址',
					name : 'address',
					labelWidth : 40,
					margin : '5 0 0 0',
					regex : /^[\u4e00-\u9fa5\w,.!""，。！“”]*$/,
					regexText : '请输入中英文或基本符号（,.!）',
					columnWidth : 1
				}, {
					xtype : 'htmleditor',
					grow : true,
					columnWidth : 1,
					margin : '5 0 0 0',
					name : 'des',
					height : 200,
					labelWidth : 40,
					fieldLabel : '描述'
				}],
		buttons : [{
			text : '确定',
			handler : function() {
				var form = Ext.getCmp('comm_edit_form').getForm();
				var title = this.ownerCt.ownerCt.ownerCt.title;
				var url;
				if (title == '增加') {
					url = '../../../comm/comm!addPri';
				} else {
					url = '../../../comm/comm!updatePri'
				}
				if (form.isValid()) {
					form.submit({
						clientValidation : true,
						url : url,
						success : function(form, action) {
							CommPrivateStore.load();
							Ext.getCmp('comm_edit').close();
						},
						failure : function(form, action) {
							Ext.getCmp('comm_edit').close();
							Ext.Msg
									.alert('提示',
											"<span style='color:red'>操作失败请联系管理员！</span>");

						}
					});

				}

			}
		}, {
			text : '重置',
			handler : function() {
				this.ownerCt.ownerCt.getForm().reset();
			}
		}, {
			text : '取消',
			handler : function() {
				this.ownerCt.ownerCt.ownerCt.close();
			}
		}]
	}],
	listeners : {
		render : function(p) {
			p.getEl().on("contextmenu", function(e) {
						e.preventDefault();
					})
		}
	}
})
Ext.define('MyDesktop.Comm', {
	extend : 'Ext.ux.desktop.Module',

	requires : ['Ext.form.field.HtmlEditor'
	// 'Ext.form.field.TextArea'
	],

	id : 'comm',

	init : function() {
		this.launcher = {
			text : '通讯录',
			iconCls : 'comm'
		}
	},

	createWindow : function() {
		var desktop = this.app.getDesktop();
		var win = desktop.getWindow('comm');
		if (!win) {
			win = desktop.createWindow({
				id : 'comm',
				title : '通讯录',
				width : 600,
				height : 400,
				iconCls : 'comm',
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
				layout : 'border',
				listeners : {
					render : function(p) {
						p.getEl().on("contextmenu", function(e) {// 右键事件
									e.preventDefault();
								})
					}
				},
				items : [{
							id : 'commBar',
							region : 'west',
							width : 180,
							xtype : 'commBar'
						}, {
							region : 'north',
							xtype : 'commTopPanel',
							height : 70,
							border : '1 1 1 1'
						}, {
							id : 'commBody',
							region : 'center',
							enableTabScroll : true,
							autoScroll : true,
							layout : 'fit',
							items : [{
								xtype : 'tabpanel',
								id : 'commMain',
								// alias : 'widget.voteMain',
								activeTab : 0,
								layout : 'fit',
								plugins : Ext.create('Ext.ux.TabCloseMenu'),
								items : [{
									title : '首页',
									bodyPadding : 10,
									iconCls : 'wb_home',
									html : '<center style="margin-top:100px;font-size:72px;">自我提升、良性竞争<br/>相互欣赏、相互支持</center>'
								}]
							}]

						}]
			});
		}
		return win;
	}
});
// 私人通讯录详细
var commPrivateDetail = function(record) {
	Ext.create('Ext.window.Window', {
		border : false,
		draggable : true,
		closable : true,
		modal : true,
		resizable : false,
		width : 400,
		height : 300,
		title : '私人通讯录',
		iconCls : '',// TODO
		// 样式没有加
		id : 'commPrivateDetailPanel',
		closable : true,
		layout : 'fit',
		items : [{
			xtype : 'panel',
			listeners : {
				afterrender : function(panel) {
					tpl = Ext
							.create(
									'Ext.XTemplate',
									'<table width="100%" height="100%" border="2" >'
											+ '<tr style="text-align:left;"><td style="background-color:#CCCCCC;text-align:center"><b>姓名:</b></td><td colspan="3" style="padding-left:10px;">{name}</td><tr>'
											+ '<tr style="text-align:center"><td style="background-color:#CCCCCC;" width="25%"><b>性别:</b></td><td width="25%"> '
											+ '<tpl if="sex == 0">',
									"男",
									'</tpl>',
									'<tpl if="sex == 1">',
									"女",
									'</tpl>',
									'</td><td style="background-color:#CCCCCC"><b>出生日期:</b></td><td>{birth}</td><tr>'
											+ '<tr style="text-align:center"><td style="background-color:#CCCCCC"><b>手机:</b></td><td>{tel}</td><td style="background-color:#CCCCCC"><b>QQ:</b></td><td>{qq}</td><tr>'
											+ '<tr style="text-align:center"><td style="background-color:#CCCCCC"><b>学历:</b></td><td>{record}</td><td style="background-color:#CCCCCC"><b>身份证:</b></td><td>{idCard}</td><tr>'
											+ '<tr style="text-align:left"><td style="background-color:#CCCCCC;text-align:center"><b>学校:</b></td><td  colspan="3" style="padding-left:10px;">{school}</td><tr>'
											+ '<tr style="text-align:left"><td style="background-color:#CCCCCC;text-align:center"><b>地址:</b></td><td  colspan="3" style="padding-left:10px;">{address}</td><tr>'
											+ '<tr style="text-align:left"><td style="background-color:#CCCCCC;text-align:center"><b>描述:</b></td><td  colspan="3" style="padding-left:10px;">{des}</td><tr>'
											+ '</table>');
					tpl.overwrite(panel.body, record.data);
					panel.doComponentLayout();
				}
			}
		}],
		buttonAlign : 'center',
		buttons : [{
					text : '确定',
					handler : function() {
						this.ownerCt.ownerCt.close();
					}
				}]
	}).show();
}
// 公共通讯录详细
var commPublicDetail = function(record) {
	Ext.create('Ext.window.Window', {
		border : false,
		draggable : true,
		closable : true,
		modal : true,
		resizable : false,
		width : 400,
		height : 500,
		title : '公共通讯录',
		iconCls : '',// TODO
		// 样式没有加
		id : 'commPublicDetailPanel',
		closable : true,
		layout : 'fit',
		items : [{
			xtype : 'panel',
			listeners : {
				afterrender : function(panel) {
					tpl = Ext
							.create(
									'Ext.XTemplate',
									'<table width="100%" height="100%" border="2">',
									'<tr style="text-align:center"><td style="background-color:#CCCCCC;"><b>姓名：</b></td><td>{userName}</td><td colspan="2" rowspan="3" height="60" width="60"><img  height="100%" src="../../../{userImg}"/><tpl if="!userImg"><img  height="100%" src="../../../userImg/user.png"/></tpl></td></tr>',
									'<tr style="text-align:center"><td style="text-align:center;background-color:#CCCCCC"><b>性别:</b></td><td><tpl if="userSex==0">男</tpl><tpl if="userSex==1">女</tpl></td></tr>',
									'<tr style="text-align:center"><td style="text-align:center;background-color:#CCCCCC"><b>出生日期:</b></td><td>{userBirth}</td></tr>',
									'<tr style="text-align:center"><td style="background-color:#CCCCCC" width="25%"><b>部门:</b></td><td width="25%">{departName}</td><td style="background-color:#CCCCCC" width="25%"><b>职位:</b></td><td>{position}</td><tr>',
									'<tr style="text-align:center"><td style="background-color:#CCCCCC"><b>角色:</b></td><td>{roleName}</td><td style="background-color:#CCCCCC"><b>状态:</b></td><td>{userState}</td><tr>',
									'<tr style="text-align:center"><td style="background-color:#CCCCCC"><b>手机:</b></td><td>{userTel}</td><td style="background-color:#CCCCCC"><b>QQ:</b></td><td>{userQq}</td><tr>',
									'<tr style="text-align:center"><td style="background-color:#CCCCCC"><b>学校:</b></td><td>{userSchool}</td><td style="background-color:#CCCCCC"><b>学历:</b></td><td>{userRecord}</td><tr>',
									'<tr style="text-align:left"><td style="background-color:#CCCCCC;text-align:center"><b>地址:</b></td><td  colspan="3" style="padding-left:10px;">{userAddress}</td><tr>',
									'<tr style="text-align:left"><td style="background-color:#CCCCCC;text-align:center"><b>描述:</b></td><td  colspan="3" style="padding-left:10px;">{userDes}</td><tr>',
									'</table>');
					tpl.overwrite(panel.body, record.data);
					panel.doComponentLayout();
				}
			}
		}],
		buttonAlign : 'center',
		buttons : [{
					text : '确定',
					handler : function() {
						this.ownerCt.ownerCt.close();
					}
				}]
	}).show();
}
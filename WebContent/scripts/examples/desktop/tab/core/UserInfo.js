Ext.define('user', {
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
					}]
		});
var userStore = Ext.create('Ext.data.Store', {
			model : 'user',
			pageSize : 20,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../security/user!getAll',
					update : '../../../security/user!updateJson',
					destroy : '../../../security/user!delete',
					create : '../../../security/user!add'// 现在没有用
				},
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'items',
					totalProperty : 'total'
				},
				writer : {
					root : 'data',
					encode : true
				}
			}
		});
var filter_departStore = Ext.create('Ext.data.Store', {
			fields : ['id', 'text'],
			proxy : {
				type : 'ajax',
				url : '../../../security/depart!getNames',
				reader : {
					type : 'json'
				}
			}
		});
var filter_roleStore = Ext.create('Ext.data.Store', {
			fields : ['id', 'text'],
			proxy : {
				type : 'ajax',
				url : '../../../security/roleRight!getNames',
				reader : {
					type : 'json'
				}
			}
		});
var positionStore = Ext.create('Ext.data.Store', {
			fields : ['id', 'text'],
			proxy : {
				type : 'ajax',
				url : '../../../security/position!getNames',
				reader : {
					type : 'json'
				}
			}
		});
var filters = {
	ftype : 'filters',
	encode : false, // json encode the filter query
	local : false
	// defaults to false (remote filtering)
	/*
	 * filters : [{ type : 'boolean', dataIndex : 'visible' //对应grid 中的列 }]
	 */
};
// 定义自己的API
var required = '<span style="color:red;font-weight:bold" data-qtip="不可为空！">*</span>';
var userState_Store = Ext.create('Ext.data.Store', {
			fields : [{
						name : 'stateId'
					}, {
						name : 'userState'
					}],
			data : [{
						'stateId' : '1',
						'userState' : '试用期'
					}, {
						'stateId' : '2',
						'userState' : '在职'
					}, {
						'stateId' : '3',
						'userState' : '离职'
					}, {
						'stateId' : '4',
						'userState' : '非正式'
					}, {
						'stateId' : '5',
						'userState' : '外出'
					}, {
						'stateId' : '6',
						'userState' : '出差'
					}, {
						'stateId' : '7',
						'userState' : '请假'
					}]
		})
// 删除
var _delete = function() {
	var grid = Ext.getCmp('user_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.hasSelection()) {
		var select = selModel.getSelection();
		userStore.remove(select);
		userStore.sync();

	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
	}
}
// 修改
var user_edit = function() {
	var grid = Ext.getCmp('user_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.getSelection().length == 1) {
		var window = Ext.create('user_EditWindow', {
					title : '修改'
				}).show();
		var select = selModel.getSelection();
		Ext.getCmp('user_form').getForm().loadRecord(select[0]);
	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请选择一条数据！</span>");
	}
}
// 增加，修改Window
Ext.define('user_EditWindow', {
	extend : 'Ext.window.Window',
	width : 500,
	title : '',
	id : 'user_add',
	frame : true,
	border : false,
	draggable : true,
	closable : true,
	modal : true,
	resizable : false,
	items : [{
		xtype : 'form',
		// bodyPadding : 5,
		id : 'user_form',
		layout : 'anchor',
		frame : true,
		defaults : {
			anchor : '100%',
			msgTarget : 'side'
		},
		items : [{
					xtype : 'hiddenfield',
					name : 'id'
				}, {
					xtype : 'fieldset',
					title : '基本信息',
					// collapsible : true,
					defaultType : 'textfield',
					layout : 'column',
					items : [{
								fieldLabel : '姓名',
								name : 'userName',
								regex : /^[\u4e00-\u9fa5\w]*$/,
								regexText : '请输入中英文',
								labelWidth : 40,
								margin : '0 10 0 0',
								allowBlank : false,
								afterLabelTextTpl : required,
								columnWidth : 1
							}, {
								xtype : 'combobox',
								fieldLabel : '部门',
								editable : false,
								allowBlank : false,
								store : filter_departStore,
								name : 'departName',
								margin : '5 10 0 0',
								afterLabelTextTpl : required,
								queryMode : 'remote',
								labelWidth : 40,
								displayField : 'text',
								valueField : 'id',
								columnWidth : .5
							}, {
								xtype : 'combobox',
								fieldLabel : '职位',
								editable : false,
								allowBlank : false,
								store : positionStore,
								name : 'position',
								margin : '5 10 0 5',
								afterLabelTextTpl : required,
								queryMode : 'remote',
								labelWidth : 40,
								displayField : 'text',
								valueField : 'id',
								columnWidth : .5
							}, {
								xtype : 'combobox',
								allowBlank : false,
								fieldLabel : '角色',
								margin : '5 10 0 0',
								name : 'roleName',
								editable : false,
								labelWidth : 40,
								afterLabelTextTpl : required,
								store : filter_roleStore,
								queryMode : 'remote',
								displayField : 'text',
								valueField : 'id',
								columnWidth : .5
							}, {
								xtype : 'combobox',
								fieldLabel : '状态',
								allowBlank : false,
								editable : false,
								margin : '5 10 0 5',
								name : 'userState',
								afterLabelTextTpl : required,
								labelWidth : 40,
								store : userState_Store,
								queryMode : 'local',
								displayField : 'userState',
								valueField : 'stateId',
								hiddenName : 'stateId',
								columnWidth : .5
							}]
				}, {
					xtype : 'fieldset',
					title : '登录信息',
					checkboxToggle : true,
					collapsed : true,
					defaultType : 'textfield',
					layout : 'column',
					items : [{
								fieldLabel : '密码',
								name : 'password',
								margin : '5 10 0 0',
								id : 'pwd',
								labelWidth : 40,
								regex : /^\w*$/,
								regexText : '请输入英文或数字！',
								inputType : "password",
								columnWidth : 1
							}]
				}, {
					xtype : 'fieldset',
					title : '其它资料',
					checkboxToggle : true,
					collapsed : false,
					defaultType : 'textfield',
					layout : 'column',
					items : [{
								xtype : 'label',
								text : '性别：',
								labelWidth : 40,
								margin : '5 0 0 0'
							}, {
								xtype : 'radio',
								boxLabel : '男',
								name : 'userSex',
								checked : true,
								inputValue : '0',
								margin : '0 0 0 10',
								columnWidth : .2
							}, {
								xtype : 'radio',
								boxLabel : '女',
								name : 'userSex',
								inputValue : '1',
								margin : '0 0 0 5',
								columnWidth : .2
							}, {
								xtype : 'datefield',
								fieldLabel : '出生日期',
								labelWidth : 65,
								format : 'Y-m-d',
								margin : '0 0 0 8',
								name : 'userBirth',
								columnWidth : .565
							}, {
								fieldLabel : '手机',
								name : 'userTel',
								margin : '5 0 0 0',
								labelWidth : 40,
								regex : /^[0-9]{11}$/,
								regexText : '请输入11位数字',
								columnWidth : .5
							}, {
								fieldLabel : 'QQ',
								name : 'userQq',
								margin : '5 0 0 30',
								labelWidth : 35,
								regex : /^[0-9]*$/,
								regexText : '请输入数字',
								columnWidth : .55
							}, {
								fieldLabel : '学校',
								name : 'userSchool',
								margin : '5 0 0 0',
								regex : /^[\u4e00-\u9fa5\w,.!""，。！“”]*$/,
								regexText : '请输入中英文或基本符号（,.!）',
								labelWidth : 40,
								columnWidth : .5
							}, {
								fieldLabel : '学历',
								name : 'userRecord',
								margin : '5 0 0 25',
								regex : /^[\u4e00-\u9fa5\w,.!""，。！“”]*$/,
								regexText : '请输入中英文或基本符号（,.!）',
								labelWidth : 40,
								columnWidth : .55
							}, {
								fieldLabel : '地址',
								name : 'userAddress',
								labelWidth : 40,
								margin : '5 0 0 0',
								regex : /^[\u4e00-\u9fa5\w,.!""，。！“”]*$/,
								regexText : '请输入中英文或基本符号（,.!）',
								columnWidth : 1.05
							}, {
								xtype : 'htmleditor',
								grow : true,
								columnWidth : 1.05,
								margin : '5 0 0 0',
								name : 'userDes',
								height : 200,
								labelWidth : 40,
								fieldLabel : '描述'
							}]
				}],
		buttons : [{
			text : '确定',
			handler : function() {
				var form = Ext.getCmp('user_form').getForm();
				var title = Ext.getCmp('user_add').title;
				var url;
				if (title == '增加') {
					url = '../../../security/user!add';
				} else {
					url = '../../../security/user!update'
				}
				if (form.isValid()) {
					form.submit({
						clientValidation : true,
						url : url,
						success : function(form, action) {
							userStore.load();
							Ext.getCmp('user_add').close();
						},
						failure : function(form, action) {
							Ext.getCmp('user_add').close();
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
				Ext.getCmp('user_form').getForm().reset();
			}
		}, {
			text : '取消',
			handler : function() {
				Ext.getCmp('user_add').close();
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
// 右键菜单
var user_menu = Ext.create('Ext.menu.Menu', {
			margin : '0 0 10 0',
			items : [{
						iconCls : 'add',
						text : '增加',
						handler : function() {
							Ext.create('user_EditWindow', {
										title : '增加'
									}).show();
						}
					}, {
						iconCls : 'tabel_edit',
						text : '修改',
						handler : function() {
							user_edit()
						}

					}, {
						iconCls : 'delte0',
						text : '删除',
						handler : function() {
							user_delete();
						}
					}, {
						iconCls : 'refresh',
						text : '刷新',
						handler : function() {
							user_refresh()
						}
					}]
		})
// 刷新
var user_refresh = function() {
	userStore.load();
}
// 删除
var user_delete = function() {
	var grid = Ext.getCmp('user_grid');
	var selModel = grid.getSelectionModel();
	if (selModel.hasSelection()) {
		var select = selModel.getSelection();
		userStore.remove(select);
		userStore.sync();

	} else {
		Ext.Msg.alert('提示', "<span style='color:red'>请至少选择一条数据！</span>");
	}
}
Ext.define('UserInfo', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.userInfo',
	layout : 'fit',
	items : [{
		xtype : 'grid',
		forceFit : true,
		height : 400,
		frame : true,
		id : 'user_grid',
		store : userStore,
		multiSelect : true,
		dockedItems : [{
			xtype : 'pagingtoolbar',
			store : userStore,
			displayInfo : true,
			dock : 'bottom',
			displayMsg : "当前显示从{0}至{1}， 共<span style='color:red;font-size:14px;'>{2}</span>条数据"
		}],
		tbar : ['-', {
					iconCls : 'add',
					text : '增加',
					handler : function() {
						Ext.create('user_EditWindow', {
									title : '增加'
								}).show();
					}
				}, '-', {
					iconCls : 'delte0',
					text : '删除',
					handler : user_delete
				}, '-', {
					iconCls : 'tabel_edit',
					text : '修改',
					handler : user_edit
				}, '-', {
					iconCls : 'refresh',
					text : '刷新',
					handler : user_refresh
				}, '-', '->', '-', {
					width : 200,
					fieldLabel : '搜索',
					labelWidth : 35,
					emptyText : '姓名',
					xtype : 'searchfield',
					store : userStore
				}, '-', {
					xtype : 'splitbutton',
					text : '',
					iconCls : 'help',
					menu : [{
								text : '图文帮助',
								iconCls : 'help_img',
								handler : function() {
									userSearch_imgShow();
								}
							}, {
								text : '视频帮助',
								iconCls : 'help_video',
								handler : function() {
									userSearch_videoShow();
								}
							}]
				}],
		columns : [{
					header : '编号',
					dataIndex : 'id',
					filter : true,
					filter : {
						type : 'numeric'
						// specify disabled to disable the filter menu
						// , disabled: true
					}
				}, {
					header : '姓名',
					filter : true,
					dataIndex : 'userName',
					filter : {
						type : 'string'
					}
				}, {
					header : '性别',
					filter : true,
					dataIndex : 'userSex',
					renderer : function(v) {
						if (v == 0) {
							return '男'
						} else {
							return "<span style='color:red'>女</span>"
						}
					},
					filter : {
						type : 'list',
						options : ['男', '女']
					}
				}, {
					header : '所属部门',
					filter : true,
					dataIndex : 'departName',
					filter : {
						type : 'list',
						store : filter_departStore
					}
				}, {
					header : '职位',
					filter : true,
					dataIndex : 'position',
					filter : {
						type : 'list',
						store : positionStore
					}
				}, {
					header : '角色',
					filter : true,
					dataIndex : 'roleName',
					filter : {
						type : 'list',
						store : filter_roleStore
					}
				}, {
					header : '状态',
					filter : true,
					dataIndex : 'userState',
					renderer : function(v) {
						if (v == '离职 ' || v == '请假' || v == '外出' || v == '出差') {
							return "<span style='color:red'>" + v + "</span>"
						} else {
							return v;
						}
					},
					filter : {
						type : 'list',
						options : ['试用期', '在职', '离职 ', '非正式', '外出', '出差', '请假']
					}
				}],
		features : [filters],
		plugins : [{
			ptype : 'rowexpander',
			rowBodyTpl : [
					"<p style='padding-left:60px; line-height:0px;'><b>生日:</b> {userBirth}<b style='margin-left:20px;'>QQ:</b> {userQq}<b style='margin-left:20px;'>电话:</b> {userTel}</p><br>",
					"<p style='padding-left:60px; line-height:0px;'><b>学校:</b> {userSchool}<b style='margin-left:20px;'>学历:</b> {userRecord}<b style='margin-left:20px;'>现住址:</b> {userAddress}<b style='margin-left:20px;'>描述:</b> {userDes}</p>"]
		}],
		selType : 'checkboxmodel',
		listeners : {
			containercontextmenu : function(view, e, eOpts) {
				e.preventDefault();
				user_menu.showAt(e.getXY());
			},
			itemcontextmenu : function(view, record, item, index, e, eOpts) {
				e.preventDefault();
				user_menu.showAt(e.getXY());
			}
		}
	}],
	listeners : {
		afterrender : function() {
			userStore.load();
		},
		render : function(p) {
			p.getEl().on("contextmenu", function(e) {
						e.preventDefault();
					})
		}
	}
});

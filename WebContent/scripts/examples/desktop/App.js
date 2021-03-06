/*
 * ! Ext JS Library 4.0 Copyright(c) 2006-2011 Sencha Inc. licensing@sencha.com
 * http://www.sencha.com/license
 */
var wallpaper = "desktop2.jpg";
var stretch = false;
// 定义自己的API
var required = '<span style="color:red;font-weight:bold" data-qtip="不可为空！">*</span>';
Ext.Ajax.request({
			url : '../../../security/desktop!getUserDesktop',
			success : function(response) {
				var mySet = response.responseText;
				if (mySet != 'false') {
					length = mySet.lastIndexOf('-');
					wallpaper = mySet.substr(0, length);
					stretch = mySet.substr(length + 1);
				}
			}
		});
// 密码确认
Ext.apply(Ext.form.field.VTypes, {
			password : function(val, field) {
				if (Ext.getCmp('pwd').value == field.value) {
					return true
				}
				return false
			},
			passwordText : '两次密码不一样!'
		});
Ext.define('MyDesktop.App', {
	extend : 'Ext.ux.desktop.App',

	requires : ['Ext.window.MessageBox', 'Ext.ux.desktop.ShortcutModel',
			'MyDesktop.BogusMenuModule', 'MyDesktop.BogusModule',
			'MyDesktop.Office', 'MyDesktop.Email', 'MyDesktop.Comm', 'MyDesktop.Vote', 'MyDesktop.Settings'],

	init : function() {

		this.callParent();
		this.initShortcut();
	},

	getModules : function() {
		return [new MyDesktop.Office(),
				new MyDesktop.Email(),new MyDesktop.Comm(),new MyDesktop.Vote(),new MyDesktop.BogusMenuModule()];
	},

	getDesktopConfig : function() {
		var me = this, ret = me.callParent();

		return Ext.apply(ret, {
					// cls: 'ux-desktop-black',
					contextMenuItems : [{
								text : '更换桌面',
								handler : me.onSettings,
								scope : me
							}],

					shortcuts : Ext.create('Ext.data.Store', {
								model : 'Ext.ux.desktop.ShortcutModel',
								data : [{
											name : '办公',
											iconCls : 'office-shortcut',
											module : 'office'
										}, {
											name : '内部邮箱',
											iconCls : 'email-shortcut',
											module : 'email'
										}, {
											name : '通讯录',
											iconCls : 'comm-shortcut',
											module : 'comm'
										}, {
											name : '投票',
											iconCls : 'vote-shortcut',
											module : 'vote'
										}]
							}),
					wallpaper : wallpaper,
					wallpaperStretch : false
				});
	},
	// config for the start menu
	getStartConfig : function() {
		var me = this, ret = me.callParent();

		return Ext.apply(ret, {
			title : Ext.getBody().html,
			iconCls : 'user',
			height : 300,
			toolConfig : {
				width : 100,
				items : [{
					text : Ext.getBody().html,
					id:'current_user',
					iconCls : 'user',
					handler : function() {
						Ext.create('Ext.window.Window', {
							width : 400,
							frame : true,
							border : false,
							id : 'user_info_current',
							draggable : false,
							closable : true,
							modal : true,
							height : 200,
							title : Ext.getBody().html,
							resizable : false,
							layout : 'fit',
							items : [{
								xtype : 'tabpanel',
								items : [{
									title : '基本信息',
									layout : 'column',
									frame : true,
									items : [{
												xtype : 'form',
												columnWidth : .6,
												id : 'userInfo_showForm',
												frame : true,
												defaultType : 'textfield',
												layout : 'column',
												items : [{
															fieldLabel : '部门',
															name : 'departName',
															readOnly : true,
															margin : '5 0 0 10',
															labelWidth : 40
														}, {
															fieldLabel : '职位',
															margin : '10 0 0 10',
															readOnly : true,
															name : 'position',
															labelWidth : 40
														}, {
															fieldLabel : '角色',
															margin : '10 0 0 10',
															readOnly : true,
															name : 'roleName',
															labelWidth : 40
														}, {
															fieldLabel : '状态',
															margin : '10 0 0 10',
															readOnly : true,
															name : 'userState',
															labelWidth : 40
														}]
											}, {
												xtype : 'panel',
												frame : true,
												columnWidth : .4,
												layout : 'column',
												buttonAlign : 'center',
												items : [{
													xtype : 'image',
													height : 94,
													border : 1,
													id : 'user_img_file',
													margin : '0 0 0 25',
													shrinkWrap : true,
													style : {
														borderColor : 'grey',
														borderStyle : 'solid'
													},
													src : 'images/userImg/user.png',
													listeners : {
														render : function(e) {
															Ext.Ajax.request({
																url : '../../../security/userImg!getImgCurrent',
																success : function(res) {
																  var url=res.responseText;
																  if(url!='false'){
																    e.setSrc('../../../'+url);
																  }
																},
																failure : function(
																		res) {

																}
															});

														}
													}
												}],
												buttons : [{
															text : '修改头像',
															handler : this.uploadImg
														}]
											}]
								}, {
									title : '修改密码',
									frame : true,
									layout : 'fit',
									// buttonAlign:'center',
									buttons : [{
												text : '确认',
												disabled : true,
												id : 'password_ok',
												handler : this.updatePass
											}, {
												text : '重置',
												handler : function() {
													Ext
															.getCmp('resetPassword_form')
															.getForm().reset();
												}
											}],
									items : [{
										xtype : 'form',
										frame : true,
										id : 'resetPassword_form',
										layout : 'column',
										defaultType : 'textfield',
										items : [{
											fieldLabel : '原密码',
											allowBlank : false,
											afterLabelTextTpl : required,
											margin : '5 0 0 85',
											id : 'userPassword',
											inputType : "password",
											labelWidth : 50,
											listeners : {
												blur : function(p) {
													Ext.Ajax.request({
														url : '../../../security/user!currentUserPassword',
														success : function(res) {
															if (res.responseText == p.value) {
																Ext
																		.getCmp('password_ok')
																		.setDisabled(false);
															} else {
																Ext
																		.getCmp('password_ok')
																		.setDisabled(true);
															}
														},
														failure : function(res) {

														}
													});
												}
											}
										}, {
											fieldLabel : '新密码',
											allowBlank : false,
											margin : '10 0 0 85',
											id : 'pwd',
											inputType : "password",
											afterLabelTextTpl : required,
											name : 'password',
											labelWidth : 50
										}, {
											fieldLabel : '新密码确认',
											allowBlank : false,
											margin : '10 0 0 60',
											inputType : "password",
											vtype : 'password',
											afterLabelTextTpl : required,
											labelWidth : 75
										}]
									}]
								}]
							}]
						}).show();
						Ext.Ajax.request({
									url : '../../../security/user!currentUser',
									success : function(res) {
										var currentUser = Ext
												.decode(res.responseText);
										Ext.getCmp('userInfo_showForm')
												.getForm()
												.loadRecord(currentUser);
									},
									failure : function(res) {

									}
								});

					},
					scope : me
				}, '-', {
					text : '设置',
					iconCls : 'settings',
					handler : me.onSettings,
					scope : me
				}, '-', {
					text : '帮助与关于',
					iconCls : 'help',
					handler : function() {
						Ext.create('Sys_help').show();
					}
				}, '->', {
					text : '注销',
					iconCls : 'wb_shutdown',
					handler : me.onLogout,
					scope : me
				}]
			}
		});
	},
	updatePass : function() {
		var form = Ext.getCmp('resetPassword_form').getForm();
		if (form.isValid()) {
			form.submit({
						url : '../../../security/user!updatePwd',
						success : function(fp, o) {
							Ext.Msg.alert('提示', "操作成功！")
							form.reset();
						},
						failure : function(fp, o) {
							Ext.Msg
									.alert('提示',
											"<span style='color:red'>操作失败请联系管理员！</span>")
							form.reset();
						}
					})
		}
	},
	uploadImg : function() {
		Ext.create('Ext.window.Window', {
			width : 250,
			id : 'uploadImg_window',
			frame : true,
			border : false,
			draggable : false,
			closable : true,
			resizable : false,
			modal : true,
			items : [{
				xtype : 'form',
				frame : true,
				id : 'userImg_form',
				items : [{
							xtype : 'filefield',
							id : 'userImg_File',
							emptyText : '选择头像',
							labelWidth : 70,
							allowBlank : false,
							fieldLabel : '上传头像',
							name : 'userImg',
							buttonText : '',
							buttonConfig : {
								iconCls : 'upload-icon'
							}
						}],
				buttons : [{
					text : '确认',
					handler : function() {
						var form = Ext.getCmp('userImg_form').getForm();
						if (form.isValid()) {
							var image = Ext.getCmp('userImg_File').value
							var type = image.substr(image.lastIndexOf('.') + 1)
							if (type != 'png') {
								Ext.Msg
										.alert('提示',
												"<span style='color:red'>请上传  png 格式头像！</span>")
							} else {
								form.submit({
									url : '../../../security/userImg!setImgCurrent',
									waitTitle : '提示',
									waitMsg : '正在在上传',
									success : function(fp, o) {
										Ext.getCmp('user_img_file')
												.setSrc('../../../'
														+ o.result.msg);

										Ext.getCmp('uploadImg_window').close();
									},
									failure : function(fp, o) {
										Ext.Msg
												.alert('提示',
														"<span style='color:red'>操作失败请联系管理员！</span>")
										Ext.getCmp('uploadImg_window').close();
									}
								})
							}
						}
					}
				}, {
					text : '取消',
					handler : function() {
						Ext.getCmp('uploadImg_window').close();
					}
				}]
			}]
		}).show();

	},
	getTaskbarConfig : function() {
		var ret = this.callParent();

		return Ext.apply(ret, {
					quickStart : [{
								name : '内部邮箱',
								iconCls : 'email',
								module : 'email'
							}, {
								name : '通讯录',
								iconCls : 'comm',
								module : 'comm'
							}],
					trayItems : [{
								xtype : 'trayclock',
								flex : 1
							}]
				});
	},

	onLogout : function() {
		Ext.Msg.confirm('提示', '你确定要退出吗？', function callBack(id) {
					if (id == 'yes') {
						Ext.Ajax.request({
									url : '../../../security/user!logout',
									success : function() {
										window.location.href = 'index.jsp';
									},
									failure : function() {
										window.location.href = 'index.jsp';
									}
								});
					}
				});
	},

	onSettings : function() {
		var dlg = new MyDesktop.Settings({
					desktop : this.desktop
				});
		dlg.show();
	},

	initShortcut : function() {
		var btnHeight = 50;
		var btnWidth = 60;
		var btnPadding = 30;
		var col = null;
		var row = null;
		var bottom;
		var numberofIterms = 0;
		var bodyHeight = Ext.getBody().getHeight();
		function initColRow() {
			col = {
				index : 1,
				x : btnPadding
			};
			row = {
				index : 1,
				y : btnPadding
			};
		}

		initColRow();

		function isOverflow(value, bottom) {
			if (value > 6 || bodyHeight < bottom) {
				return true;
			}
			return false;
		}

		this.setXY = function(item) {
			numberofIterms += 1;
			bottom = row.y + btnHeight;
			overflow = isOverflow(numberofIterms, bottom);
			if (overflow && bottom > (btnHeight + btnPadding)) {
				numberofIterms = 0;
				col = {
					index : col.index++,
					x : col.x + btnWidth + btnPadding
				};
				row = {
					index : 1,
					y : btnPadding
				};
			}
			Ext.fly(item).setXY([col.x, row.y]);
			row.index++;
			row.y = row.y + btnHeight + btnPadding;
		};

		this.handleUpdate = function() {
			initColRow();
			var items = Ext.query(".ux-desktop-shortcut");
			for (var i = 0, len = items.length; i < len; i++) {
				this.setXY(items[i]);
			}
		};
		this.handleUpdate();
	}
});

/*
 * ! Ext JS Library 4.0 Copyright(c) 2006-2011 Sencha Inc. licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('MyDesktop.BogusMenuModule', {
			extend : 'MyDesktop.BogusModule',

			init : function() {

				this.launcher = {
					text : '附件',
					iconCls : 'bogus',
					handler : function() {
						return false;
					},
					menu : {
						items : []
					}
				};
				this.launcher.menu.items.push({
							text : '飞影战士',
							iconCls : 'game1',
							handler : this.createWindow,
							scope : this,
							windowId : 1
						});
				this.launcher.menu.items.push({
							text : '俄罗斯方块',
							iconCls : 'game2',
							handler : this.createWindow,
							scope : this,
							windowId : 2
						});
			}
		});
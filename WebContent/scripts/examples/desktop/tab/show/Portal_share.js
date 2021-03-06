var portal_shareFileStore = Ext.create('Ext.data.Store', {
			model : 'shareFile',
			pageSize : 6,
			proxy : {
				type : 'ajax',
				api : {
					read : '../../../share/shareManager!getShow'
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
Ext.define('PortalShare', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.portalShare',
	layout : 'fit',
	items : [{
		region : 'center',
		xtype : 'panel',
		layout : 'fit',
		items : [{
			xtype : 'grid',
			forceFit : true,
			frame : true,
			store : portal_shareFileStore,
			multiSelect : false,
			columns : [{
				header : '',
				dataIndex : 'fileType',
				width : 15,
				renderer : function(v) {
					if (v.indexOf('doc') >= 0) {
						return "<img src='images/img/word.gif' title='WORD'/>"
					} else if (v.indexOf('xls') >= 0) {
						return "<img src='images/img/excel.gif' title='EXCEL' />"
					} else if (v.indexOf('txt') >= 0) {
						return "<img src='images/img/txt.gif' title='记事本'/>"
					} else if (v.indexOf('psd') >= 0) {
						return "<img src='images/img/icon_psd.gif' title='图像'/>"
					} else if (v.indexOf('avi') >= 0 || v.indexOf('rmvb') >= 0
							|| v.indexOf('mv') >= 0 || v.indexOf('mkv') >= 0
							|| v.indexOf('rm') >= 0 || v.indexOf('wmv') >= 0
							|| v.indexOf('mp4') >= 0) {
						return "<img src='images/img/icon_mv.gif' title='视频'/>"
					} else if (v.indexOf('mp3') >= 0) {
						return "<img src='images/img/icon_mp3.gif' title='音乐'/>"
					} else if (v.indexOf('pdf') >= 0) {
						return "<img src='images/img/icon_pdf.gif' title='PDF'/>"
					} else if (v.indexOf('ppt') >= 0) {
						return "<img src='images/img/icon_ppt.gif' title='PPT'/>"
					} else if (v.indexOf('chm') >= 0) {
						return "<img src='images/img/icon_chm.gif'  />"
					} else if (v.indexOf('exe') >= 0) {
						return "<img src='images/img/icon_exe.gif' title='运行文件'/>"
					} else if (v.indexOf('jpg') >= 0 || v.indexOf('png') >= 0
							|| v.indexOf('gif') >= 0) {
						return "<img src='images/img/jpg.gif' title='图像' />"
					} else {
						return "<img src='images/img/png-0023.png' title='未知'/>"
					}
				}
			}, {
				header : '文件名',
				dataIndex : 'title'
			}, {
				header : '上传人',
				dataIndex : 'shareUser'
			}],
			listeners : {
				/*afterrender : function() {
					portal_shareFileStore.load();
				},*/
				containercontextmenu : function(view, e, eOpts) {
					e.preventDefault();
				},
				itemcontextmenu : function(view, record, item, index, e, eOpts) {
					e.preventDefault();
				},
				itemdblclick : function(view, record, item, index, e, eOpts) {
					shareDownLoad(record, false);
				}
			}
		}]
	}]
});
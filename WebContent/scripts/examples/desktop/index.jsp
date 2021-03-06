<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<base href="/oa/scripts/examples/desktop/index.jsp">
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>OA</title>
		<link rel="stylesheet" type="text/css"
			href="../../resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css" href="css/myCss.css" />
		<script type="text/javascript">
</script>
		<link rel="stylesheet" type="text/css" href="css/desktop.css" />
		<link rel="stylesheet" type="text/css" href="css/office.css" />
		<link rel="stylesheet" type="text/css" href="css/portal.css" />
		<script type="text/javascript" src="../../../scripts/bootstrap.js">
</script>
		<script type="text/javascript" src="js/Module.js">
</script>
		<script type="text/javascript" src="js/Wallpaper.js">
</script>
		<script type="text/javascript" src="js/StartMenu.js">
</script>
		<script type="text/javascript" src="js/TaskBar.js">
</script>
		<script type="text/javascript" src="js/ShortcutModel.js">
</script>
		<script type="text/javascript" src="js/Desktop.js">
</script>
		<script type="text/javascript" src="js/App.js">
</script>
		<script type="text/javascript" src="js/SearchField.js">
</script>
		<script type="text/javascript" src="WallpaperModel.js">
</script>
		<script type="text/javascript" src="BogusModule.js">
</script>
		<script type="text/javascript" src="BogusMenuModule.js">
</script>
		<script type="text/javascript" src="Settings.js">
</script>
		<script type="text/javascript" src="BogusMenuModule.js">
</script>
		<script type="text/javascript" src="BogusModule.js">
</script>
		<script type="text/javascript" src="Settings.js">
</script>
		<script type="text/javascript" src="WallpaperModel.js">
</script>
		<script type="text/javascript" src="Office.js">
</script>
<script type="text/javascript" src="js/StatusBar.js">
</script>
<script type="text/javascript" src="js/TabCloseMenu.js">
</script>
<script type="text/javascript" src="js/LiveSearchGridPanel.js">
</script>
<script type="text/javascript" src="js/DateRange.js">
</script>
		<script type="text/javascript" src="Email.js">
</script>
		<script type="text/javascript" src="Vote.js">
</script>
		<script type="text/javascript" src="Comm.js">
</script>
		<script type="text/javascript" src="App.js">
</script>
        <script type="text/javascript" src="tab/help/FindFail.js">
</script>
        <script type="text/javascript" src="tab/help/UserSearch.js">
</script>
		<script type="text/javascript" src="tab/core/RoleManager.js">
</script>
		<script type="text/javascript" src="tab/core/DepartInfo.js">
</script>
        <script type="text/javascript" src="tab/core/UserInfo.js">
</script>
         <script type="text/javascript" src="tab/core/PositionInfo.js">
</script>
        <script type="text/javascript" src="tab/process/FlowManager.js">
</script>
        <script type="text/javascript" src="js/RowExpander.js">
</script>  
        <script type="text/javascript" src="portal/Portlet.js">
</script>
        <script type="text/javascript" src="portal/PortalColumn.js">
</script>
        <script type="text/javascript" src="portal/PortalDropZone.js">
</script>
        <script type="text/javascript" src="portal/PortalPanel.js">
</script>
        <script type="text/javascript" src="tab/process/FlowManager_leave.js">
</script>
        <script type="text/javascript" src="tab/process/FlowManager_expense.js">
</script>
        <script type="text/javascript" src="tab/process/FlowManager_waitFlow.js">
</script> 
        <script type="text/javascript" src="tab/attendance/WorkExtraApply.js">
</script>
        <script type="text/javascript" src="tab/attendance/WorkExamine_extra.js">
</script>
         <script type="text/javascript" src="tab/attendance/OutApply.js">
</script>
        <script type="text/javascript" src="tab/attendance/WorkExamine_out.js">
</script> 
        <script type="text/javascript" src="tab/attendance/WorkoutApply.js">
</script>
        <script type="text/javascript" src="tab/attendance/WorkExamine_outWork.js">
</script>
        <script type="text/javascript" src="tab/attendance/WorkCensus.js">
</script>
        <script type="text/javascript" src="tab/task/Task_arrange.js">
</script>
        <script type="text/javascript" src="tab/share/ShareMananger.js">
</script>
        <script type="text/javascript" src="tab/task/Task_list.js">
</script>
        <script type="text/javascript" src="tab/notice/Notice.js">
</script>
        <script type="text/javascript" src="tab/report/Report.js">
</script>
        <script type="text/javascript" src="tab/report/ExamineReport.js">
</script>
        <script type="text/javascript" src="tab/show/Portal_notice.js">
</script>
        <script type="text/javascript" src="tab/show/Portal_task_list.js">
</script>
        <script type="text/javascript" src="tab/show/Portal_share.js">
</script>
        <script type="text/javascript" src="tab/show/Portal_waitFlow.js">
</script>
        <script type="text/javascript" src="tab/Sys_help.js">
</script>
        <script type="text/javascript" src="grid/filter/Filter.js">
</script>
        <script type="text/javascript" src="grid/filter/BooleanFilter.js">
</script>
        <script type="text/javascript" src="grid/filter/DateFilter.js">
</script>
       
        <script type="text/javascript" src="grid/filter/ListFilter.js">
</script>
        <script type="text/javascript" src="grid/filter/NumericFilter.js">
</script>
        <script type="text/javascript" src="grid/filter/StringFilter.js">
</script>
        <script type="text/javascript" src="grid/FiltersFeature.js">
</script>
        <script type="text/javascript" src="grid/RangeMenu.js">
</script>
        <script type="text/javascript" src="grid/ListMenu.js">
</script>
		<script type="text/javascript" src="ext-lang-zh_CN.js">
</script>
		<script type="text/javascript" src="../../../scripts/utils/BaseWin.js">
</script>
		<script type="text/javascript" src="KeyMap.js">
</script>
		<script type="text/javascript"
			src="../../../scripts/utils/BaseForm.js">
</script>
<link rel="stylesheet" type="text/css" href="grid/css/GridFilters.css" />
<link rel="stylesheet" type="text/css" href="grid/css/RangeMenu.css" />
		<script type="text/javascript">

Ext.Loader.setPath( {
	'Ext.ux.desktop' : 'js',
	MyDesktop : ''
});
Ext.require('MyDesktop.App');

var myDesktopApp;
Ext.onReady(function() {
			Ext.QuickTips.init();
			var required = '<span style="color:red;font-weight:bold" data-qtip="不可为空！">*</span>';
			// 登录表单
			var IdTest = /^[0-9]{6}$/;
			Ext.apply(Ext.form.field.VTypes, {
				userID : function(val, field) {
					return IdTest.test(val);
				},
				userIDText : '请输入6位数字!',
				userIDMask : /^[0-9]$/
			});
			Ext.define('userInfoForm', {
				extend : 'BaseForm',
				id : 'userInfo_Form',
				alias : 'widget.userForm',
				items : [ {
					fieldLabel : '账号',
					afterLabelTextTpl : required,
					anchor : '80%',
					labelWidth : 40,
					name : 'id',
					margin : '0 0 5 45',
					vtype : 'userID',
					allowBlank : false
				}, {
					fieldLabel : '密码',
					afterLabelTextTpl : required,
					margin : '0 0 10 45',
					anchor : '80%',
					regex : /^\w*$/,
					regexText : '请输入英文或数字！',
					labelWidth : 40,
					name : 'password',
					inputType : "password",
					allowBlank : false
				} ]
			});
			// 登录窗口
			Ext.define('loginWindow', {
				extend : 'BaseWin',
				title : '欢迎使用OA系统',
				iconCls : '',
				draggable : false,
				width : 330,
				modal : false,
				id : 'login_win',
				layout : 'fit',
				items : [ {
					xtype : 'userForm'
				} ],
				buttons : [ {
					text : '确定',
					handler : function() {
						var form = Ext.getCmp('userInfo_Form').getForm();
						if (form.isValid()) {
							form.submit( {
								clientValidation : true,
								url : '../../../security/user!login',//action 地址
								success : function(form, action) {
									Ext.getBody().html = action.result.user;
									myDesktopApp = new MyDesktop.App();
									portal_taskListStore.load();
									portal_shareFileStore.load();
									protalNoticeStore.load();
									waitFlowStore.load();
									Ext.getCmp('login_win').hide();
								},
								failure : function(form, action) {
								    if(action.result.msg=='error'){
									   Ext.Msg.alert('提示',  "<span style='color:red'>账号或密码输入不正确 </span>");
									}else{
									   Ext.Msg.alert('提示', "<span style='color:red'>您现在的状态是离职，不能登录系统！</span>");
									}
								}
							});

						}
					}
				}, {
					text : '重置',
					handler : function() {
						Ext.getCmp('userInfo_Form').getForm().reset();
					}
				} ]

			});
			Ext.Ajax.request( {
				url : '../../../security/user!getUserSession',
				success : function(res) {
					if (res.responseText != 'false') {
						Ext.getBody().html = res.responseText;
						myDesktopApp = new MyDesktop.App();
						portal_taskListStore.load();
						portal_shareFileStore.load();
						protalNoticeStore.load();
						waitFlowStore.load();
					} else {
						Ext.create("loginWindow").show();
					}
				}
			});
           
		});
</script>
		<style type="text/css">
.welcome {
	background-image: url("../../examples/desktop/wallpapers/desktop2.jpg");
}
</style>
	</head>
	<body class="welcome">
	</body>
</html>

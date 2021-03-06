var userSearch_imgShow = function() {
	var tabpanel = Ext.getCmp("MainTab");
	var tab = tabpanel.getComponent('userSearch_img');
	if (!tab) {
		tab = tabpanel.add({
					title : '查看帮助',
					iconCls : 'help_img',
					id : 'userSearch_img',
					xtype : 'userSearch_img',
					closable : true
				})
	}
	tabpanel.setActiveTab(tab);
}
var userSearch_videoShow = function() {
	var tabpanel = Ext.getCmp("MainTab");
	var tab = tabpanel.getComponent('userSearch_videoShow');
	if (!tab) {
		tab = tabpanel.add({
					title : '查看帮助',
					iconCls : 'help_video',
					id : 'userSearch_videoShow',
					xtype : 'userSearch_videoShow',
					closable : true
				})
	}
	tabpanel.setActiveTab(tab);
}
Ext.define('UserSearch_img', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.userSearch_img',
	id : 'userSearch_img',
	autoScroll : true,
	html : '<h1 style="margin-top:20px;margin-bottom:20px;">为了方便对员工的查询，有如下查询方式</h1>'
			+ '<img src="tab/help/img/userSearch_help1.PNG"/>'
			+ '<p>这里是对员工编号进行查询，有大于、小于、等于</p>'
			+ '<img src="tab/help/img/userSearch_help2.PNG">'
			+ '<p>这里是对员工姓名进行查询支持模糊查询，这条件和原来的条件是并且的关系</p>'
			+ '<img src="tab/help/img/userSearch_help3.PNG">'
			+ '<p>这里是对员工职位进行查询，这些条件和原来的条件也是并且的关系，<span style="color:red">其它都一样</span></p>'
})
Ext.define('UserSearch_video', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.userSearch_videoShow',
	id : 'userSearch_videoShow',
	autoScroll : true,
	html : "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' width='1200' height='800' id='FLVPlayer'>"
			+ "<param name='movie' value='FLVPlayer_Progressive.swf' />"
			+ "<param name='quality' value='high' />"
			+ "<param name='wmode' value='opaque' />"
			+ "<param name='scale' value='noscale' />"
			+ "<param name='salign' value='lt' />"
			+ " <param name='FlashVars' value='&amp;MM_ComponentVersion=1&amp;skinName=tab/help/video/Clear_Skin_3&amp;streamName=9%3D9&amp;autoPlay=false&amp;autoRewind=false' />"
			+ " <param name='swfversion' value='8,0,0,0' />"
			+ " <!-- 此 param 标签提示使用 Flash Player 6.0 r65 和更高版本的用户下载最新版本的 Flash Player。如果您不想让用户看到该提示，请将其删除。 -->"
			+ "  <param name='expressinstall' value='Scripts/expressInstall.swf' />"
			+ "  <!-- 下一个对象标签用于非 IE 浏览器。所以使用 IECC 将其从 IE 隐藏。 -->"
			+ " <!--[if !IE]>-->"
			+ " <object type='application/x-shockwave-flash' data='tab/help/video/FLVPlayer_Progressive.swf' width='1200' height='800'>"
			+ "   <!--<![endif]-->"
			+ "  <param name='quality' value='high' />"
			+ "  <param name='wmode' value='opaque' />"
			+ "  <param name='scale' value='noscale' />"
			+ "   <param name='salign' value='lt' />"
			+ "   <param name='FlashVars' value='&amp;MM_ComponentVersion=1&amp;skinName=tab/help/video/Clear_Skin_3&amp;streamName=9%3D9&amp;autoPlay=false&amp;autoRewind=false' />"
			+ "   <param name='swfversion' value='8,0,0,0' />"
			+ "  <param name='expressinstall' value='Scripts/expressInstall.swf' />"
			+ "  <!-- 浏览器将以下替代内容显示给使用 Flash Player 6.0 和更低版本的用户。 -->"
			+ " <div>"
			+ "  <h4>此页面上的内容需要较新版本的 Adobe Flash Player。</h4>"
			+ "  <p><a href='http://www.adobe.com/go/getflashplayer'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='获取 Adobe Flash Player' /></a></p>"
			+ "  </div>"
			+ " <!--[if !IE]>-->"
			+ " </object>"
			+ " <!--<![endif]-->"
			+ "</object>"
			+ "<script type='text/javascript'>"
			+ "swfobject.registerObject('FLVPlayer');" + "</script>"
})
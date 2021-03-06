
Ext.define('MyDesktop.BogusModule', {
    extend: 'Ext.ux.desktop.Module',

    init : function(){
        this.launcher = {
            text: '飞影战士',
            iconCls:'bogus',
            handler : this.createWindow,
            scope: this,
            windowId:1
        }
    },

    createWindow : function(src){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('bogus'+src.windowId);
        var html='<embed src="game/feiyingzhanshi4.swf" width="100%" height="100%"></embed>';
        var title='飞影战士';
        if(src.windowId==2){
        	html='<embed src="game/0.swf" width="100%" height="100%"></embed>';
        	title='俄罗斯方块';
        }
        if(!win){
            win = desktop.createWindow({
                id: 'bogus'+src.windowId,
                title:title,
                width:640,
                height:480,
                html :html,
                iconCls: 'game'+src.windowId,
                animCollapse:false,
                constrainHeader:true
            });
        }
        win.show();
        return win;
    }
});
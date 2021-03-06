package com.wb.core.action;

import javax.annotation.Resource;
import org.apache.struts2.ServletActionContext;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.soft.core.action.AbstractAction;
import com.soft.core.utils.SystemConstant;
import com.wb.core.dao.DesktopDao;
import com.wb.core.domain.Desktop;
import com.wb.core.domain.UserInfo;

@Controller
@Scope("prototype")
public class DesktopAction extends AbstractAction {
	private DesktopDao dao;

	public DesktopDao getDao() {
		return dao;
	}

	@Resource
	public void setDao(DesktopDao dao) {
		this.dao = dao;
	}

	public void getUserDesktop() throws Exception {
		UserInfo user = (UserInfo) ServletActionContext.getContext()
				.getSession().get(SystemConstant.CURRENT_USER);
		DetachedCriteria criteria = DetachedCriteria.forClass(Desktop.class);
		criteria.add(Restrictions.eq("userInfo", user));
		try {
			Desktop desktop = (Desktop) dao.find(criteria).get(0);
			getResponse().getWriter().write(
					desktop.getDesktop() + "-" + desktop.getStretch());
		} catch (Exception e) {
			getResponse().getWriter().write("false");
		}

	}

	public void setUserDesktop() throws Exception {
		UserInfo user = (UserInfo) ServletActionContext.getContext()
				.getSession().get(SystemConstant.CURRENT_USER);
		DetachedCriteria criteria = DetachedCriteria.forClass(Desktop.class);
		criteria.add(Restrictions.eq("userInfo", user));
		String wallpaper = request.getParameter("wallpaper");
		Boolean stretch=Boolean.parseBoolean(request.getParameter("stretch"));
		try {
			Desktop desktop = (Desktop) dao.find(criteria).get(0);
			System.out.println(desktop.getStretch()+"===============>");
			desktop.setDesktop(wallpaper);
			desktop.setStretch(stretch);
			dao.update(desktop);
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			Desktop desktop=new Desktop();
			desktop.setDesktop(wallpaper);
			desktop.setStretch(stretch);
			desktop.setUserInfo(user);
			dao.add(desktop);
			getResponse().getWriter().write("true");
		}
	}
}

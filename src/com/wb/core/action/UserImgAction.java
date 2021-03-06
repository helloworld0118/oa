package com.wb.core.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.annotation.Resource;
import org.apache.struts2.ServletActionContext;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.soft.core.action.AbstractAction;
import com.soft.core.utils.SystemConstant;
import com.wb.core.dao.DesktopDao;
import com.wb.core.dao.UserImgDao;
import com.wb.core.domain.Desktop;
import com.wb.core.domain.UserImg;
import com.wb.core.domain.UserInfo;

@Controller
@Scope("prototype")
public class UserImgAction extends AbstractAction {
	private File userImg;
	private String userImgFileName;
	private String userImgFileType;
	private UserImgDao dao;

	public UserImgDao getDao() {
		return dao;
	}

	public File getUserImg() {
		return userImg;
	}

	public void setUserImg(File userImg) {
		this.userImg = userImg;
	}

	public String getUserImgFileName() {
		return userImgFileName;
	}

	public void setUserImgFileName(String userImgFileName) {
		this.userImgFileName = userImgFileName;
	}

	public String getUserImgFileType() {
		return userImgFileType;
	}

	public void setUserImgFileType(String userImgFileType) {
		this.userImgFileType = userImgFileType;
	}

	@Resource
	public void setDao(UserImgDao dao) {
		this.dao = dao;
	}

	public void getImgCurrent() throws Exception {
		UserInfo user = (UserInfo) ServletActionContext.getContext()
				.getSession().get(SystemConstant.CURRENT_USER);
		DetachedCriteria criteria = DetachedCriteria.forClass(UserImg.class);
        criteria.createAlias("userInfo", "u");
		criteria.add(Restrictions.eq("u.id", user.getId()));
		try {
			UserImg userImg = (UserImg) dao.find(criteria).get(0);
			getResponse().getWriter().write(userImg.getImgUrl());
		} catch (Exception e) {
			getResponse().getWriter().write("false");
		}

	}

	public void setImgCurrent() throws Exception {
		UserInfo user = (UserInfo) ServletActionContext.getContext()
				.getSession().get(SystemConstant.CURRENT_USER);
		DetachedCriteria criteria = DetachedCriteria.forClass(UserImg.class);
		 criteria.createAlias("userInfo", "u");
			criteria.add(Restrictions.eq("u.id", user.getId()));
		String msg=null;
		Gson gson=new Gson();
		if (null != userImg) {
			InputStream input = new FileInputStream(userImg);
			String path = request.getRealPath("userImg");
			String url = path + File.separator + user.getId();
			File file = new File(url);
			System.out.println(url);
			if (!file.exists()) {
				file.mkdirs();
			}
			OutputStream os = new FileOutputStream(url + File.separator
					+ userImgFileName);
			byte[] bt = new byte[1024];
			int in = 0;
			while ((in = input.read(bt)) != -1) {
				os.write(bt, 0, in);
			}
			input.close();
			os.close();
			msg = "userImg/" + user.getId() + "/"+ userImgFileName;
		}
		try {
			UserImg userImg = (UserImg) dao.find(criteria).get(0);
			userImg.setImgUrl(msg);
			userImg.setUserInfo(user);
			dao.update(userImg);
			getResponse().getWriter().write(
					"{'success':true,'msg':" + gson.toJson(msg) + "}");
		} catch (Exception e) {
			UserImg userImg = new UserImg();
			userImg.setImgUrl(msg);
			userImg.setUserInfo(user);
			dao.add(userImg);
		
			getResponse().getWriter().write(
					"{'success':true,'msg':" + gson.toJson(msg) + "}");
		}
	}
}

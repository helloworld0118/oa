package com.wb.comm.action;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.annotation.Resource;

import org.apache.struts2.ServletActionContext;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ModelDriven;
import com.soft.core.action.AbstractAction;
import com.soft.core.utils.BeanUtil;
import com.soft.core.utils.JsonOperate;
import com.wb.comm.dao.CommDao;
import com.wb.comm.domain.Communication;
import com.wb.core.domain.UserImg;
import com.wb.core.domain.UserInfo;

@Controller
@Scope("prototype")
public class CommAction extends AbstractAction implements
		ModelDriven<Communication> {
	private static final long serialVersionUID = 1L;

	private CommDao dao;

	private Communication comm = new Communication();

	@Override
	public Communication getModel() {
		return comm;
	}

	public CommDao getDao() {
		return dao;
	}

	@Resource
	public void setDao(CommDao dao) {
		this.dao = dao;
	}

	public void getCurrentUserPic() throws Exception {
		DetachedCriteria criteria = DetachedCriteria.forClass(UserImg.class);
		criteria.add(Restrictions.eq("userInfo", getCurrentUser()));
		List<UserImg> list = dao.find(criteria);
		InputStream in = null;
		if (null != list && list.size() > 0) {
			in = ServletActionContext.getServletContext().getResourceAsStream(list.get(0).getImgUrl());
			if (null != in) {
			} else {
				in = ServletActionContext.getServletContext()
						.getResourceAsStream("/userImg/user.png");
			}
		} else {
			in = ServletActionContext.getServletContext().getResourceAsStream(
					"/userImg/user.png");
		}
		FileCopyUtils.copy(in, getResponse().getOutputStream());
	}

	public void privateInfo() throws Exception {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(Communication.class);
		criteria.add(Restrictions.eq("userId", getCurrentUser().getId()));
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(Communication.class);
		criteriaCount.add(Restrictions.eq("userId", getCurrentUser().getId()));
		if (null != query && !"".equals(query)) {
			criteria.add(Restrictions.like("name", query, MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("name", query,
					MatchMode.ANYWHERE));
		}
		List<Communication> list = dao.find(criteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new Communication());
		Gson gson = new Gson();
		getResponse().getWriter().write(
				JsonOperate.getpageJson(count, gson.toJson(list)));
	}

	public void publicInfo() throws Exception {
		DetachedCriteria queryCriteria = null;
		queryCriteria = DetachedCriteria.forClass(UserInfo.class);
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(UserInfo.class);
		if (null != getQuery() && !"".equals(getQuery())) {
			queryCriteria.add(Restrictions.like("userName", getQuery(),
					MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("userName", getQuery(),
					MatchMode.ANYWHERE));
		}
		List<UserInfo> list = dao.find(queryCriteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new Communication());
		getResponse().getWriter().write(
				JsonOperate.getpageJson(count, formatToJson(list)));
	}

	public String formatToJson(List<UserInfo> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (UserInfo userInfo : list) {
			DetachedCriteria criteria = DetachedCriteria
					.forClass(UserImg.class);
			criteria.add(Restrictions.eq("userInfo", userInfo));
			List<UserImg> imgs = dao.find(criteria);
			sb.append("{");
			sb.append("'id':'" + userInfo.getId() + "',");
			sb.append("'departName':'" + userInfo.getDepart().getDepartName()
					+ "',");
			sb.append("'position':'" + userInfo.getPosition().getPositionName()
					+ "',");
			sb.append("'roleName':'" + userInfo.getRoleInfo().getRoleName()
					+ "',");
			sb.append("'userState':'" + userInfo.getUserState().getStateType()
					+ "',");
			sb.append("'userRecord':'" + toNull(userInfo.getUserRecord())
					+ "',");
			if (null != imgs && imgs.size() > 0) {
				sb.append("'userImg':'" + imgs.get(0).getImgUrl() + "',");
			}
			sb.append("'userName':'" + userInfo.getUserName() + "',");
			sb.append("'password':'" + toNull(userInfo.getPassword()) + "',");
			sb.append("'userSex':'" + toNull(userInfo.getUserSex()) + "',");
			sb.append("'userQq':'" + toNull(userInfo.getUserQq()) + "',");
			sb.append("'userTel':'" + toNull(userInfo.getUserTel()) + "',");
			sb.append("'userAddress':'" + toNull(userInfo.getUserAddress())
					+ "',");
			sb.append("'userDes':'" + toNull(userInfo.getUserDes()) + "',");
			sb.append("'userSchool':'" + toNull(userInfo.getUserSchool())
					+ "',");
			sb.append("'userBirth':'" + toNull(userInfo.getUserBirth()) + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	private String toNull(Object object) {
		if (null == object) {
			return "";
		} else {
			return object.toString();
		}
	}

	public void addPri() throws IOException {
		comm.setUserId(getCurrentUser().getId());
		dao.save(comm);
		getResponse().getWriter().write("true");
	}

	public void deletePri() throws Exception {
		dao.delete(comm);
		getResponse().getWriter().write("true");
	}

	public void updatePri() throws Exception {
		Communication target = dao.get(comm.getId());
		BeanUtil.copy(comm, target);
		dao.update(target);
		getResponse().getWriter().write("true");
	}
}

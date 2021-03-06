package com.wb.core.action;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.ServletResponse;

import org.apache.struts2.ServletActionContext;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.opensymphony.xwork2.ModelDriven;
import com.soft.core.action.AbstractAction;
import com.soft.core.action.BaseAction;
import com.soft.core.dao.GenericDao;
import com.soft.core.utils.JsonOperate;
import com.wb.core.dao.RoleInfoDao;
import com.wb.core.domain.Depart;
import com.wb.core.domain.RoleAndRight;
import com.wb.core.domain.RoleInfo;
import com.wb.core.domain.RoleRight;
import com.wb.core.utils.TreeModel;

@Controller
@Scope("prototype")
public class RoleInfoAction extends BaseAction<RoleInfo> {
	private static final long serialVersionUID = -3018446041368362629L;
	private RoleInfoDao dao;

	@Override
	public GenericDao<RoleInfo> getDao() {
		return dao;
	}

	@Resource
	public void setDao(RoleInfoDao dao) {
		this.dao = dao;
	}

	public void getAll() {
		DetachedCriteria queryCriteria = null;
		queryCriteria = DetachedCriteria.forClass(RoleInfo.class);
		DetachedCriteria criteriaCount=DetachedCriteria.forClass(RoleInfo.class);
		if (null != getQuery() && !"".equals(getQuery())) {
			queryCriteria.add(Restrictions.like("roleName", getQuery(),
					MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("roleName", getQuery(),
					MatchMode.ANYWHERE));
		}
		List<RoleInfo> lists = dao.find(queryCriteria, getStart(), getLimit());
		GsonBuilder builder = new GsonBuilder();
		builder.excludeFieldsWithoutExposeAnnotation();
		Gson gson = builder.create();
		String roleInfoJson = gson.toJson(lists);
		Long count = dao.getCount(criteriaCount, new RoleInfo());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, roleInfoJson));
		} catch (IOException e) {
		}
	}

	public void updateJson() {
		String json = request.getParameter("data");
		System.out.println(json);
		Gson gson = new Gson();
		try {
			List<RoleInfo> list = gson.fromJson(json,
					new TypeToken<List<RoleInfo>>() {
					}.getType());
			for (RoleInfo roleInfo : list) {
				try {
					DetachedCriteria criteria = DetachedCriteria
							.forClass(RoleInfo.class);
					criteria.add(Restrictions.eq("roleName", roleInfo
							.getRoleName()));
					roleInfo = (RoleInfo) dao.find(criteria).get(0);
					getResponse().getWriter().write("false");
				} catch (Exception e) {
					super.update(roleInfo);
				}
			}
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			try {
				RoleInfo roleInfo = gson.fromJson(json, RoleInfo.class);
				try {
					DetachedCriteria criteria = DetachedCriteria
							.forClass(RoleInfo.class);
					criteria.add(Restrictions.eq("roleName", roleInfo
							.getRoleName()));
					roleInfo = (RoleInfo) dao.find(criteria).get(0);
					getResponse().getWriter().write("false");
				} catch (Exception e2) {
					super.update(roleInfo);
				}
			} catch (Exception e2) {
				try {
					getResponse().getWriter().write("false");
				} catch (IOException e1) {
				}
			}
		}
	}

	public void update() {
		try {
			try {
				DetachedCriteria criteria = DetachedCriteria
						.forClass(RoleInfo.class);
				criteria.add(Restrictions.eq("roleName", model
						.getRoleName()));
				criteria.add(Restrictions.not(Restrictions.eq("id", model.getId())));
		    	RoleInfo roleInfo = (RoleInfo) dao.find(criteria).get(0);
		    	getResponse().getWriter().write(
				"{'success':false,'msg':'have'}");
				return;
			} catch (Exception e) {
				super.update(model);
			}
			getResponse().getWriter().write("{'success':true}");
		} catch (Exception e) {
			try {
				getResponse().getWriter().write("{'success':false}");
			} catch (IOException e1) {
			}
		}
	}

	public void add() {
		try {
			try {
				DetachedCriteria criteria = DetachedCriteria
						.forClass(RoleInfo.class);
				criteria.add(Restrictions.eq("roleName", model
						.getRoleName()));
		    	RoleInfo roleInfo = (RoleInfo) dao.find(criteria).get(0);
		    	getResponse().getWriter().write(
				"{'success':false,'msg':'have'}");
				return;
			} catch (Exception e) {
				dao.add(model);
			}
			getResponse().getWriter().write("{'success':true}");
		} catch (Exception e) {
			try {
				getResponse().getWriter().write("{'success':false}");
			} catch (IOException e1) {
			}
		}
	}

	public void delete() {
		String json = request.getParameter("data");
		System.out.println(json);
		Gson gson = new Gson();
		try {
			List<RoleInfo> list = gson.fromJson(json,
					new TypeToken<List<RoleInfo>>() {
					}.getType());
			for (RoleInfo RoleInfo : list) {
				dao.delete(RoleInfo);
			}
		} catch (Exception e) {
			try {
				RoleInfo RoleInfo = gson.fromJson(json, RoleInfo.class);
				dao.delete(RoleInfo);
			} catch (Exception e2) {
			}
		}
	}

	public void getNames() {
		DetachedCriteria criteria = DetachedCriteria.forClass(RoleInfo.class);
		List<RoleInfo> lists = dao.find(criteria);
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (RoleInfo role : lists) {
			sb.append("{'id':'" + role.getId() + "',");
			sb.append("'text':'" + role.getRoleName() + "'},");
		}
		if (lists.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		try {
			getResponse().getWriter().write(sb.toString());
		} catch (IOException e) {
		}
	}
}

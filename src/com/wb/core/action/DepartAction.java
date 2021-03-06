package com.wb.core.action;

import java.io.IOException;
import java.util.List;
import javax.annotation.Resource;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.soft.core.action.BaseAction;
import com.soft.core.dao.GenericDao;
import com.soft.core.utils.JsonOperate;
import com.wb.core.dao.DepartDao;
import com.wb.core.domain.Depart;
import com.wb.core.domain.RoleInfo;

@Controller
@Scope("prototype")
public class DepartAction extends BaseAction<Depart> {

	private static final long serialVersionUID = 1L;
	private DepartDao dao;

	@Resource
	public void setDao(DepartDao dao) {
		this.dao = dao;
	}

	@Override
	public GenericDao<Depart> getDao() {
		return dao;
	}

	public void getAll() throws Exception {
		DetachedCriteria queryCriteria=null;
		queryCriteria=DetachedCriteria.forClass(Depart.class);
		DetachedCriteria criteriaCount=DetachedCriteria.forClass(Depart.class);
		if (null != getQuery() && !"".equals(getQuery())) {
			queryCriteria.add(Restrictions.like("departName", getQuery(),
					MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("departName", getQuery(),
					MatchMode.ANYWHERE));
		}
		List<Depart> lists = dao.find(queryCriteria, getStart(), getLimit());
		Gson gson = new Gson();
		String departJson = gson.toJson(lists);
		Long count = dao.getCount(criteriaCount,new Depart());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, departJson));
		} catch (Exception e) {
		}
	}

	public void updateJson() {
		String json = request.getParameter("data");
		System.out.println(json);
		Gson gson = new Gson();
		try {
			List<Depart> list = gson.fromJson(json,
					new TypeToken<List<Depart>>() {
					}.getType());
			for (Depart depart : list) {
				try {
					DetachedCriteria criteria = DetachedCriteria
							.forClass(Depart.class);
					criteria.add(Restrictions.eq("departName", depart
							.getDepartName()));
					depart = (Depart) dao.find(criteria).get(0);
					getResponse().getWriter().write("false");
				} catch (Exception e2) {
					super.update(depart);
				}
			}
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			try {
				Depart depart = gson.fromJson(json, Depart.class);
				try {
					DetachedCriteria criteria = DetachedCriteria
							.forClass(Depart.class);
					criteria.add(Restrictions.eq("departName", depart
							.getDepartName()));
					depart = (Depart) dao.find(criteria).get(0);
					getResponse().getWriter().write("false");
				} catch (Exception e2) {
					super.update(depart);
				}

			} catch (Exception e2) {
				e2.printStackTrace();
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
						.forClass(Depart.class);
				criteria.add(Restrictions.eq("departName", model
						.getDepartName()));
				criteria.add(Restrictions.not(Restrictions.eq("id", model.getId())));
				Depart depart = (Depart) dao.find(criteria).get(0);
				getResponse().getWriter().write(
						"{'success':false,'msg':'have'}");
				return;
			} catch (Exception e) {
				dao.update(model);
				getResponse().getWriter().write("{'success':true}");
			}
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
						.forClass(Depart.class);
				criteria.add(Restrictions.eq("departName", model
						.getDepartName()));
				Depart depart = (Depart) dao.find(criteria).get(0);
				getResponse().getWriter().write(
						"{'success':false,'msg':'have'}");
				return;
			} catch (Exception e) {
				dao.add(model);
				getResponse().getWriter().write("{'success':true}");
			}
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
			List<Depart> list = gson.fromJson(json,
					new TypeToken<List<Depart>>() {
					}.getType());
			for (Depart depart : list) {
				super.delete(depart);
			}
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			try {
				Depart depart = gson.fromJson(json, Depart.class);
				super.delete(depart);
			} catch (Exception e2) {
				e2.printStackTrace();
				try {
					getResponse().getWriter().write("false");
				} catch (IOException e1) {
				}
			}
		}
	}
	public void getNames(){
		DetachedCriteria criteria=DetachedCriteria.forClass(Depart.class);
		List<Depart> lists=dao.find(criteria);
		StringBuffer sb=new StringBuffer();
		sb.append("[");
		for (Depart depart : lists) {
			sb.append("{'id':'"+depart.getId()+"',");
			sb.append("'text':'"+depart.getDepartName()+"'},");
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

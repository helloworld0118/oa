package com.wb.core.action;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.soft.core.action.BaseAction;
import com.soft.core.dao.GenericDao;
import com.soft.core.utils.JsonOperate;
import com.wb.core.dao.PostionDao;
import com.wb.core.domain.Depart;
import com.wb.core.domain.Position;

@Controller
@Scope("prototype")
public class PositionAction extends BaseAction<Position> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6479908488119689216L;
	private PostionDao dao;

	@Resource
	public void setDao(PostionDao dao) {
		this.dao = dao;
	}

	@Override
	public GenericDao<Position> getDao() {
		return dao;
	}

	public void getAll() throws Exception {
		DetachedCriteria queryCriteria = null;
		queryCriteria = DetachedCriteria.forClass(Position.class);
		DetachedCriteria criteriaCount=DetachedCriteria.forClass(Position.class);
		if (null != getQuery() && !"".equals(getQuery())) {
			queryCriteria.add(Restrictions.like("positionName", getQuery(),
					MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("positionName", getQuery(),
					MatchMode.ANYWHERE));
		}
		List<Position> lists = dao.find(queryCriteria, getStart(), getLimit());
		Gson gson = new Gson();
		String positionJson = gson.toJson(lists);
		Long count = dao.getCount(criteriaCount, new Position());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, positionJson));
		} catch (Exception e) {
		}
	}

	public void updateJson() {
		String json = request.getParameter("data");
		System.out.println(json);
		Gson gson = new Gson();
		try {
			List<Position> list = gson.fromJson(json,
					new TypeToken<List<Position>>() {
					}.getType());
			for (Position position : list) {
				try {
					DetachedCriteria criteria = DetachedCriteria
							.forClass(Position.class);
					criteria.add(Restrictions.eq("positionName", position
							.getPositionName()));
					position = (Position) dao.find(criteria).get(0);
					getResponse().getWriter().write("false");
				} catch (Exception e2) {
					super.update(position);
				}
			}
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			try {
				Position position = gson.fromJson(json, Position.class);
				try {
					DetachedCriteria criteria = DetachedCriteria
							.forClass(Position.class);
					criteria.add(Restrictions.eq("positionName", position
							.getPositionName().trim()));
					position = (Position) dao.find(criteria).get(0);
					getResponse().getWriter().write("false");
				} catch (Exception e2) {
					super.update(position);
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
						.forClass(Position.class);
				criteria.add(Restrictions.eq("positionName", model
						.getPositionName()));
				criteria.add(Restrictions.not(Restrictions.eq("id", model.getId())));
				Position position = (Position) dao.find(criteria).get(0);
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
						.forClass(Position.class);
				criteria.add(Restrictions.eq("positionName", model
						.getPositionName()));
				Position position = (Position) dao.find(criteria).get(0);
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
			List<Position> list = gson.fromJson(json,
					new TypeToken<List<Position>>() {
					}.getType());
			for (Position position : list) {
				super.delete(position);
			}
		} catch (Exception e) {
			try {
				Position position = gson.fromJson(json, Position.class);
				super.delete(position);
			} catch (Exception e2) {
				e2.printStackTrace();
			}
		}
	}

	public void getNames() {
		DetachedCriteria criteria = DetachedCriteria.forClass(Position.class);
		List<Position> lists = dao.find(criteria);
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (Position position : lists) {
			sb.append("{'id':'" + position.getId() + "',");
			sb.append("'text':'" + position.getPositionName() + "'},");
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

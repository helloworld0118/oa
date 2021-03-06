package com.wb.core.action;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.struts2.ServletActionContext;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Example;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.opensymphony.xwork2.ActionSupport;
import com.soft.core.action.AbstractAction;
import com.soft.core.action.BaseAction;
import com.soft.core.dao.GenericDao;
import com.soft.core.utils.JsonOperate;
import com.soft.core.utils.SystemConstant;
import com.wb.core.dao.CalenderDao;
import com.wb.core.dao.DepartDao;
import com.wb.core.domain.Calender;
import com.wb.core.domain.Depart;
import com.wb.core.domain.UserInfo;
import com.wb.core.utils.CalenderUpdate;

@Controller
@Scope("prototype")
public class CalenderAction extends ActionSupport {

	private static final long serialVersionUID = 1L;
	private CalenderDao dao;
	// 日期开始时间
	private String start;
	// 日期结束时间
	private String end;
	private int limit;
	private int page;
	private ServletRequest request = ServletActionContext.getRequest();
	private ServletResponse response = ServletActionContext.getResponse();

	public ServletResponse getResponse() {
		response.setContentType("text/html;charset=UTF-8");
		return response;
	}

	public void setResponse(ServletResponse response) {
		this.response = response;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public String getStart() {
		return start;
	}

	public void setStart(String start) {
		this.start = start;
	}

	public String getEnd() {
		return end;
	}

	public void setEnd(String end) {
		this.end = end;
	}

	@Resource
	public void setDao(CalenderDao dao) {
		this.dao = dao;
	}

	public void read() throws Exception {
		DetachedCriteria criteria = DetachedCriteria.forClass(Calender.class);
		UserInfo user = (UserInfo) ServletActionContext.getContext().getSession().get(
				SystemConstant.CURRENT_USER);
		criteria.add(Restrictions.eq("userId", user.getId()));
		List<Calender> lists = dao.find(criteria, (page - 1) * limit,
				getLimit());
		try {
			getResponse().getWriter().write(getJson(lists));
		} catch (Exception e) {
		}
	}

	public void add() {
		String json = request.getParameter("evts");
		GsonBuilder builder = new GsonBuilder();
		builder.excludeFieldsWithoutExposeAnnotation();
		Gson gson = builder.create();
		try {
			Calender calender = gson.fromJson(json, Calender.class);
			UserInfo user = (UserInfo) ServletActionContext.getContext().getSession().get(
					SystemConstant.CURRENT_USER);
			calender.setUserId(user.getId());
			dao.add(calender);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private String getJson(List<Calender> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("{'evts':[");
		for (Calender calender : list) {
			sb.append("{'id':'" + toNull(calender.getEventId()) + "','cid':'"
					+ calender.getCalendarId() + "','title':'"
					+ calender.getTitle() + "','start':'"
					+ calender.getStartDate() + "','end':'"
					+ calender.getEndDate() + "','loc':'"
					+ toNull(calender.getLocation()) + "','notes':'"
					+ toNull(calender.getNotes()) + "','url':'"
					+ toNull(calender.getUrl()) + "','ad':'"
					+ toNull(calender.getIsAllDay()) + "','rem':'"
					+ toNull(calender.getReminder()) + "','isRem':'"
					+ toNull(calender.getIsReminder()) + "','n':'"
					+ toNull(calender.getIsNew()) + "'},");
		}
		if(list.size()>0){
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]}");
		return sb.toString();
	}

	private String toNull(Object object) {
		if (null == object) {
			return "";
		} else {
			return object.toString();
		}
	}

	public void update() {
		if (null != request.getParameter("data")) {
			String json = request.getParameter("data");
			GsonBuilder builder = new GsonBuilder();
			builder.excludeFieldsWithoutExposeAnnotation();
			Gson gson = builder.create();
			try {
				Calender calender = gson.fromJson(json, Calender.class);
				UserInfo user = (UserInfo) ServletActionContext.getContext().getSession().get(
						SystemConstant.CURRENT_USER);
				calender.setUserId(user.getId());
				dao.update(calender);
			} catch (Exception e) {
				try {
					getResponse().getWriter().write("false");
				} catch (IOException e1) {
				}
			}
		}
	}

	public void delete() {
		if (null != request.getParameter("evts")) {
			String json = request.getParameter("evts");
			GsonBuilder builder = new GsonBuilder();
			builder.excludeFieldsWithoutExposeAnnotation();
			Gson gson = builder.create();
			try {
				Calender calender = gson.fromJson(json, Calender.class);
				UserInfo user = (UserInfo) ServletActionContext.getContext().getSession().get(
						SystemConstant.CURRENT_USER);
				calender.setUserId(user.getId());
				dao.delete(calender);
			} catch (Exception e) {
			}
		}
	}
}

package com.wb.report.action;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ModelDriven;
import com.soft.core.action.AbstractAction;
import com.soft.core.utils.JsonOperate;
import com.wb.attendance.domain.OutApply;
import com.wb.core.domain.UserInfo;
import com.wb.report.dao.ReportDao;
import com.wb.report.domain.Report;

@Controller
@Scope("prototype")
public class ReportAction extends AbstractAction implements ModelDriven<Report> {
	private static final long serialVersionUID = 1L;
	private ReportDao dao;
	private Report model=new Report();

	public ReportDao getDao() {
		return dao;
	}

	@Resource
	public void setDao(ReportDao dao) {
		this.dao = dao;
	}

	public Report getModel() {
		return model;
	}

	public void setModel(Report model) {
		this.model = model;
	}

	public void getAll2me() {
		UserInfo user=getCurrentUser();
		DetachedCriteria criteria = DetachedCriteria.forClass(Report.class);
		criteria.add(Restrictions.eq("reportUser", user.getUserName() + "("
				+ user.getId() + ")"));
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(Report.class);
		criteriaCount.add(Restrictions.eq("reportUser", user.getUserName() + "("
				+ user.getId() + ")"));
		if (null != query && !"".equals(query)) {
			criteria.add(Restrictions.like("title", query, MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("title", query,
					MatchMode.ANYWHERE));
		}
		criteria.addOrder(Order.desc("id"));
		List<Report> list = dao.find(criteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new Report());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, format2Json(list)));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	public void getAll2Owner() {
		DetachedCriteria criteria = DetachedCriteria.forClass(Report.class);
		UserInfo user=getCurrentUser();
		criteria.add(Restrictions.like("examineUser", user.getUserName() + "("
				+ user.getId() + ")",MatchMode.ANYWHERE));
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(Report.class);
		criteriaCount.add(Restrictions.like("examineUser", user.getUserName() + "("
				+ user.getId() + ")",MatchMode.ANYWHERE));
		if (null != query && !"".equals(query)) {
			criteria.add(Restrictions.like("title", query, MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("title", query,
					MatchMode.ANYWHERE));
		}
		criteria.addOrder(Order.desc("id"));
		List<Report> list = dao.find(criteria, getStart(), getLimit());
		Long count = dao.getCount(criteriaCount, new Report());
		try {
			getResponse().getWriter().write(
					JsonOperate.getpageJson(count, format2Json(list)));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	private String format2Json(List<Report> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (Report report : list) {
			sb.append("{");
			sb.append("'id':'" + report.getId() + "',");
			sb.append("'beginTime':'" + report.getBeginTime() + "',");
			sb.append("'endTime':'" + report.getEndTime() + "',");
			sb.append("'title':'" + report.getTitle() + "',");
			sb.append("'time':'" + report.getTime() + "',");
			sb.append("'type':'" + report.getType() + "',");
			sb.append("'reportUser':'" + report.getReportUser() + "',");
			sb.append("'examineUser':'" + report.getExamineUser() + "',");
			sb.append("'content':'" + report.getContent() + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}
	public void add() throws Exception{
	    SimpleDateFormat format=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		model.setTime(format.format(new Date()));
		model.setReportUser(getCurrentUser().getUserName()+"("+getCurrentUser().getId()+")");
		dao.add(model);
		getResponse().getWriter().write("true");
	}
	public void delete() throws Exception{
		dao.delete(model);
		getResponse().getWriter().write("true");
	}
}

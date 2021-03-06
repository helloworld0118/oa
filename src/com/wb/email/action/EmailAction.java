package com.wb.email.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.struts2.ServletActionContext;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projection;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.soft.core.action.AbstractAction;
import com.soft.core.utils.BeanUtil;
import com.soft.core.utils.JsonOperate;
import com.wb.core.domain.UserInfo;
import com.wb.email.dao.EmailDao;
import com.wb.email.domain.EmailAttachment;
import com.wb.email.domain.EmailBox;
import com.wb.email.domain.EmailRelationAccept;

@Controller
@Scope("prototype")
public class EmailAction extends AbstractAction {
	private static final long serialVersionUID = -8065591653879013664L;
	private EmailDao dao;
	private EmailBox emailBox;
	private File emailAtt;
	private EmailRelationAccept relationAccept;
	private String emailAttFileName;

	public File getEmailAtt() {
		return emailAtt;
	}

	public void setEmailAtt(File emailAtt) {
		this.emailAtt = emailAtt;
	}

	public String getEmailAttFileName() {
		return emailAttFileName;
	}

	public void setEmailAttFileName(String emailAttFileName) {
		this.emailAttFileName = emailAttFileName;
	}

	public EmailBox getEmailBox() {
		return emailBox;
	}

	public void setEmailBox(EmailBox emailBox) {
		this.emailBox = emailBox;
	}

	public EmailDao getDao() {
		return dao;
	}

	@Resource
	public void setDao(EmailDao dao) {
		this.dao = dao;
	}

	public void quickSend() throws Exception {
		String userAccept = request.getParameter("userAccept");
		UserInfo user = new UserInfo();
		user.setId(Integer.parseInt(userAccept.substring(userAccept
				.indexOf("(") + 1, userAccept.length() - 1)));
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		emailBox.setEmailDate(format.format(new Date()));
		if (relationAccept == null) {
			relationAccept = new EmailRelationAccept();
		}
		relationAccept.setIsDelete(false);
		relationAccept.setEmailBox(emailBox);
		relationAccept.setIsRead(false);
		relationAccept.setJudge(3);
		relationAccept.setUserInfo(user);
		emailBox.getEmailRelationAccepts().add(relationAccept);
		emailBox.setIsDelete(false);
		emailBox.setJudge(0);
		emailBox.setSendUser(getCurrentUser());
		emailBox.setEmailTitle("快速回复");
		try {
			dao.add(emailBox);
			getResponse().getWriter().write("true");
		} catch (Exception e) {
			getResponse().getWriter().write("false");
		}

	}

	public void save2Straw() throws Exception {
		save(1);
	}

	public void send() throws Exception {
		save(0);
	}

	private void save(int judge) throws Exception {
		String userAccept = request.getParameter("userAccept");
		String[] accepts = userAccept.split(";");
		String[] fileNames = request.getParameterValues("atts");
		if (null != fileNames && fileNames.length > 0) {
			for (String file : fileNames) {
				EmailAttachment attachment = new EmailAttachment();
				attachment.setAtUrl(file);
				attachment.setEmailBox(emailBox);
				emailBox.getEmailAttachments().add(attachment);
			}
		}
		emailBox.setSendUser(getCurrentUser());
		emailBox.setJudge(judge);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		emailBox.setEmailDate(format.format(new Date()));
		emailBox.setIsDelete(false);
		for (String accept : accepts) {
			UserInfo user = new UserInfo();
			user.setId(Integer.parseInt(accept.substring(
					accept.indexOf("(") + 1, accept.length() - 1)));
			EmailRelationAccept eAccept = new EmailRelationAccept();
			eAccept.setEmailBox(emailBox);
			eAccept.setIsDelete(false);
			eAccept.setIsRead(false);
			if(judge==0){
				judge=3;
			}
			eAccept.setJudge(judge);
			eAccept.setUserInfo(user);
			emailBox.getEmailRelationAccepts().add(eAccept);
		}
		dao.add(emailBox);
		String success = "{'success':true,'msg':'ok'}";
		getResponse().getWriter().write(success);
	}

	public void getAll() throws Exception {
		DetachedCriteria criteria = DetachedCriteria.forClass(EmailBox.class);
		DetachedCriteria criteriaCount = DetachedCriteria.forClass(EmailBox.class);
		// 查询
		criteria.createAlias("emailRelationAccepts", "e");
		criteria.setProjection(Projections.distinct(Projections.property("e.emailBox")));
		criteria.add(Restrictions.or(Restrictions.eq("e.userInfo",
				getCurrentUser()), Restrictions
				.eq("sendUser", getCurrentUser())));
		criteria.addOrder(Order.desc("emailId"));
		criteria.add(Restrictions.eq("e.isDelete", false));
		// 计数
		criteriaCount.createAlias("emailRelationAccepts", "e");
		criteriaCount.setProjection(Projections.distinct(Projections.property("e.emailBox")));
		criteriaCount.add(Restrictions.or(Restrictions.eq("e.userInfo",
				getCurrentUser()), Restrictions
				.eq("sendUser", getCurrentUser())));
		criteriaCount.addOrder(Order.desc("emailId"));
		criteriaCount.add(Restrictions.eq("e.isDelete", false));
		if (null != getQuery() && !"".equals(getQuery())) {
			query=new String(query.getBytes("ISO-8859-1"), "UTF-8");
			criteria.add(Restrictions.like("emailTitle",query,MatchMode.ANYWHERE));
			criteriaCount.add(Restrictions.like("emailTitle",query,MatchMode.ANYWHERE));
		}
		List<EmailBox> lists = dao.find(criteria, getStart(), getLimit());
		String emailBoxJson = getListGson4All(lists);
		int count =dao.find(criteriaCount).size();
		getResponse().getWriter().write(
				JsonOperate.getpageJson(Long.parseLong(count+""), emailBoxJson));
	}

	public void getRec() throws Exception {
		DetachedCriteria criteria = DetachedCriteria.forClass(EmailBox.class);
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(EmailBox.class);
		// 查询
		criteria.createAlias("emailRelationAccepts", "e");
		criteria.add(Restrictions.eq("e.userInfo", getCurrentUser()));
		criteria.addOrder(Order.desc("emailId"));
		criteria.add(Restrictions.eq("e.judge", emailBox.getJudge()));
		criteria.add(Restrictions.eq("e.isDelete", false));
		// 计数
		criteriaCount.createAlias("emailRelationAccepts", "e");
		criteriaCount.add(Restrictions.eq("e.userInfo", getCurrentUser()));
		criteriaCount.addOrder(Order.desc("emailId"));
		criteriaCount.add(Restrictions.eq("e.judge", emailBox.getJudge()));
		criteriaCount.add(Restrictions.eq("e.isDelete", false));

		if (null != getQuery() && !"".equals(getQuery())) {
			criteria.add(Restrictions.eq("e.isRead", Boolean
					.parseBoolean(getQuery())));
			criteriaCount.add(Restrictions.eq("e.isRead", Boolean
					.parseBoolean(getQuery())));
		}
		List<EmailBox> lists = dao.find(criteria, getStart(), getLimit());
		String emailBoxJson = getListGson4Rec(lists);
		Long count = dao.getCount(criteriaCount, new EmailBox());
		getResponse().getWriter().write(
				JsonOperate.getpageJson(count, emailBoxJson));
	}

	public void getSend() throws Exception {
		DetachedCriteria criteria = DetachedCriteria.forClass(EmailBox.class);
		criteria.add(Restrictions.eq("sendUser", getCurrentUser()));
		criteria.add(Restrictions.eq("judge", emailBox.getJudge()));
		criteria.add(Restrictions.eq("isDelete", false));
		criteria.addOrder(Order.desc("emailId"));
		// 计数
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(EmailBox.class);
		criteriaCount.add(Restrictions.eq("sendUser", getCurrentUser()));
		criteriaCount.add(Restrictions.eq("judge", emailBox.getJudge()));
		criteriaCount.add(Restrictions.eq("isDelete", false));
		criteriaCount.addOrder(Order.desc("emailId"));
		List<EmailBox> lists = dao.find(criteria, getStart(), getLimit());
		String emailBoxJson = getListGson4Send(lists);
		Long count = dao.getCount(criteriaCount, new EmailBox());
		getResponse().getWriter().write(
				JsonOperate.getpageJson(count, emailBoxJson));
	}

	public void getStraw() throws Exception {
		getSend();
	}

	public void getDustbin() throws Exception {
		getRec();
	}
	public String getListGson4All(List<EmailBox> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		UserInfo currentUser=getCurrentUser();
		for (EmailBox email : list) {
			int one=email.getSendUser().getId();
			int two=currentUser.getId();
			if(one==two){
				sb.append(gsonSend(email));
			}else{
				sb.append(gsonRec(email));
			}
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}
	public String getListGson4Send(List<EmailBox> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (EmailBox email : list) {
			sb.append(gsonSend(email));
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}
    private String gsonSend(EmailBox email){
    	StringBuffer sb = new StringBuffer();
    	sb.append("{");
		sb.append("'emailId':'" + email.getEmailId() + "',");
		sb.append("'emailTitle':'" + email.getEmailTitle() + "',");
		sb.append("'userAccept':'" + getEmailUserAccept(email) + "',");
		sb.append("'userSend':'" + email.getSendUser().getUserName() + "("
				+ email.getSendUser().getId() + ")" + "',");
		sb.append("'emailContent':'" + email.getEmailContent() + "',");
		sb.append("'emailJudge':'" + email.getJudge() + "',");
		sb.append("'emailAttachments':" + JsonFlowAttach(email) + ",");
		sb.append("'emailDate':'" + email.getEmailDate() + "'");
		sb.append("},");
		return sb.toString();
    }
	public void delete() throws Exception {
		emailBox = dao.get(emailBox.getEmailId());
		String send = request.getParameter("send");
		if (send.equals("true")) {
			emailBox.setIsDelete(true);
		} else {
			EmailRelationAccept emailRelationAccept = getRelationAccept(emailBox);
			emailRelationAccept.setIsDelete(true);
		}
		dao.update(emailBox);
		getResponse().getWriter().write("true");
	}

	public String getListGson4Rec(List<EmailBox> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (EmailBox email : list) {
			sb.append(gsonRec(email));
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}
    private String gsonRec(EmailBox email){
    	StringBuffer sb = new StringBuffer();
    	sb.append("{");
		sb.append("'emailId':'" + email.getEmailId() + "',");
		sb.append("'emailTitle':'" + email.getEmailTitle() + "',");
		sb.append("'userAccept':'" + getCurrentUser().getUserName() + "("
				+ getCurrentUser().getId() + ")" + "',");
		sb.append("'userSend':'" + email.getSendUser().getUserName() + "("
				+ email.getSendUser().getId() + ")" + "',");
		sb.append("'emailContent':'" + email.getEmailContent() + "',");
		sb.append("'emailJudge':'" +getRelationAccept(email).getJudge() + "',");
		sb.append("'isRead':" + getRelationAccept(email).getIsRead() + ",");
		sb.append("'emailAttachments':" + JsonFlowAttach(email) + ",");
		sb.append("'emailDate':'" + email.getEmailDate() + "'");
		sb.append("},");
		return sb.toString();
    }
	public void getCurrentUserPower() throws Exception {
		UserInfo userInfo = getCurrentUser();
		Integer power = userInfo.getRoleInfo().getRolePower();
		getResponse().getWriter().write(power + "");

	}

	private String getEmailUserAccept(EmailBox emailBox) {
		Set<EmailRelationAccept> accepts = emailBox.getEmailRelationAccepts();
		StringBuffer sb = new StringBuffer();
		for (EmailRelationAccept emailRelationAccept : accepts) {
			sb.append(emailRelationAccept.getUserInfo().getUserName() + "("
					+ emailRelationAccept.getUserInfo().getId() + ");");
		}
		return sb.toString();
	}

	private EmailRelationAccept getRelationAccept(EmailBox emailBox) {
		Set<EmailRelationAccept> list = emailBox.getEmailRelationAccepts();
		for (EmailRelationAccept emailRelationAccept : list) {
			int one = emailRelationAccept.getUserInfo().getId();
			int two = getCurrentUser().getId();
			if (one == two) {
				return emailRelationAccept;
			}
		}
		return null;
	}

	private String JsonFlowAttach(EmailBox model) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (EmailAttachment emailAttachment : model.getEmailAttachments()) {
			sb.append("'" + emailAttachment.getAtUrl() + "',");
		}
		if (model.getEmailAttachments().size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	public void update() throws Exception {
		EmailBox target = dao.get(emailBox.getEmailId());
		EmailRelationAccept accept = getRelationAccept(target);
		if (null != accept && null != relationAccept) {
			BeanUtil.copy(relationAccept, accept);
		}
		BeanUtil.copy(emailBox, target);
		dao.update(target);
		getResponse().getWriter().write("true");
	}

	public void updateDetail() throws Exception {
		String userAccept = request.getParameter("userAccept");
		String[] accepts = null;
		if (null != userAccept && !"".equals(userAccept)) {
			accepts = userAccept.split(";");
		}
		String[] fileNames = request.getParameterValues("atts");
		emailBox.getEmailAttachments().clear();
		DetachedCriteria criteriaAtts = DetachedCriteria
				.forClass(EmailAttachment.class);
		criteriaAtts.add(Restrictions.eq("emailBox", emailBox));
		List<EmailAttachment> atts = dao.find(criteriaAtts);
		if (null != atts && atts.size() > 0) {
			for (EmailAttachment emailAttachment : atts) {
				dao.delete(emailAttachment);
			}
		}
		if (null != fileNames && fileNames.length > 0) {
			for (String file : fileNames) {
				EmailAttachment attachment = new EmailAttachment();
				attachment.setAtUrl(file);
				attachment.setEmailBox(emailBox);
				emailBox.getEmailAttachments().add(attachment);
			}
		}
		if (null != accepts) {
			emailBox.getEmailRelationAccepts().clear();
			DetachedCriteria criteriaAccepts = DetachedCriteria
					.forClass(EmailRelationAccept.class);
			criteriaAccepts.add(Restrictions.eq("emailBox", emailBox));
			List<EmailRelationAccept> listReList = dao.find(criteriaAccepts);
			if (listReList != null && listReList.size() > 0) {
				for (EmailRelationAccept emailRelationAccept : listReList) {
					dao.delete(emailRelationAccept);
				}
			}
			for (String accept : accepts) {
				UserInfo user = new UserInfo();
				user.setId(Integer.parseInt(accept.substring(accept
						.indexOf("(") + 1, accept.length() - 1)));
				EmailRelationAccept eAccept = new EmailRelationAccept();
				eAccept.setEmailBox(emailBox);
				eAccept.setIsDelete(false);
				eAccept.setIsRead(false);
				eAccept.setJudge(0);
				eAccept.setUserInfo(user);
				emailBox.getEmailRelationAccepts().add(eAccept);
			}
		}
		EmailBox target = dao.get(emailBox.getEmailId());
		EmailRelationAccept accept = getRelationAccept(target);
		if (null != accept && null != relationAccept) {
			BeanUtil.copy(relationAccept, accept);
		}
		BeanUtil.copy(emailBox, target);
		dao.update(target);
		getResponse().getWriter().write("true");
	}

	public void uploadFile() {
		UserInfo user = getCurrentUser();
		long size = emailAtt.length() / 1024 / 1024;
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
		if (size < (user.getRoleInfo().getRolePower() * 20)) {
			try {
				Random random=new Random();
				InputStream input = new FileInputStream(emailAtt);
				String path = request.getRealPath("emailAtt");
				File file = new File(path + "/" + user.getId());
				if (!file.exists()) {
					file.mkdirs();
				}
				String abPath = "/"
						+ emailAttFileName.substring(0, emailAttFileName
								.lastIndexOf(".") - 1)
						+ "_"
						+ format.format(new Date())+random.nextInt(1000000)
						+ emailAttFileName.substring(emailAttFileName
								.lastIndexOf("."));
				OutputStream os = new FileOutputStream(file + abPath);
				byte[] bt = new byte[1024];
				int in = 0;
				while ((in = input.read(bt)) != -1) {
					os.write(bt, 0, in);
				}
				input.close();
				os.close();
				String success = "{'success':true,'msg':'" + user.getId()
						+ abPath + "'}";
				getResponse().getWriter().write(success);
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else {
			String failure = "{'success':false,'msg':'文件大小超过所限定的级别！'}";
			try {
				getResponse().getWriter().write(failure);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public void deleteFile() throws Exception {
		String fileName = request.getParameter("fileName");
		String path = request.getRealPath("emailAtt");
		File file = new File(path + fileName);
		if (file.exists()) {
			file.delete();
		}
		getResponse().getWriter().write("true");
	}

	public EmailRelationAccept getRelationAccept() {
		return relationAccept;
	}

	public void setRelationAccept(EmailRelationAccept relationAccept) {
		this.relationAccept = relationAccept;
	}

	private String fileName;

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) throws Exception {
		this.fileName = new String(fileName.getBytes("ISO-8859-1"), "UTF-8");
	}

	// 从下载文件原始存放路径读取得到文件输出流
	private boolean exist=true;
	public InputStream getDownloadFile() throws Exception {
	     InputStream input=	ServletActionContext.getServletContext().getResourceAsStream(
				"/emailAtt/" + fileName);
	     if(null!=input){
	    	 return input;
	     }else{
	    	 exist=false;
	    	 return ServletActionContext.getServletContext().getResourceAsStream("/emailAtt/" +
	 				"原文件丢失.docx");
	     }
	}

	public String getDownloadChineseFileName() throws Exception {
		String downloadChineseFileName = fileName;
		try {
			downloadChineseFileName = new String(downloadChineseFileName
					.getBytes(), "ISO-8859-1");
			String[] strs = downloadChineseFileName.split("/");
			downloadChineseFileName = strs[1].substring(0, strs[1]
					.lastIndexOf("_"))
					+ strs[1].substring(strs[1].lastIndexOf("."));
			if(!exist){
				downloadChineseFileName="The original file is missing";
			}
		} catch (Exception e) {
		}
		return downloadChineseFileName;
	}

	public String execute() {
		return SUCCESS;
	}

}

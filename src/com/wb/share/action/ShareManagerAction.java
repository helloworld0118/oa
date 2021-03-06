package com.wb.share.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

import javax.annotation.Resource;

import org.apache.struts2.ServletActionContext;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.soft.core.action.AbstractAction;
import com.soft.core.utils.BeanUtil;
import com.soft.core.utils.JsonOperate;
import com.wb.core.domain.Depart;
import com.wb.core.domain.UserInfo;
import com.wb.share.dao.ShareFileDao;
import com.wb.share.domain.ShareCatalogue;
import com.wb.share.domain.ShareFile;

@Controller
@Scope("prototype")
public class ShareManagerAction extends AbstractAction {

	private static final long serialVersionUID = 1L;
	private ShareFileDao dao;
	private ShareCatalogue catalogue;
	private File share;
	private String shareFileName;

	public ShareCatalogue getCatalogue() {
		return catalogue;
	}

	public void setCatalogue(ShareCatalogue catalogue) {
		this.catalogue = catalogue;
	}

	public File getShare() {
		return share;
	}

	public void setShare(File share) {
		this.share = share;
	}

	public String getShareFileName() {
		return shareFileName;
	}

	public void setShareFileName(String shareFileName) {
		this.shareFileName = shareFileName;
	}

	public ShareFileDao getDao() {
		return dao;
	}

	@Resource
	public void setDao(ShareFileDao dao) {
		this.dao = dao;
	}

	public void getAll() throws Exception {
		if(null==query){
			return ;
		}
		String filed1 = request.getParameter("filter[0][field]");
		String filed2 = request.getParameter("filter[1][field]");
		String filed3 = request.getParameter("filter[2][field]");
		String filed4 = request.getParameter("filter[3][field]");
		String filed5 = request.getParameter("filter[4][field]");
		String filed6 = request.getParameter("filter[5][field]");
		String filed7 = request.getParameter("filter[6][field]");
		String[] fileds = new String[] { filed1, filed2, filed3, filed4,
				filed5, filed6,filed7};
		DetachedCriteria criteria = DetachedCriteria.forClass(ShareFile.class);
		criteria.createAlias("shareCatalogue", "s");
		criteria.add(Restrictions.eq("s.id", Integer.parseInt(query)));
		criteria.addOrder(Order.desc("id"));
		DetachedCriteria criteriaCount = DetachedCriteria
				.forClass(ShareFile.class);
		criteriaCount.createAlias("shareCatalogue", "s");
		criteriaCount.add(Restrictions.eq("s.id", Integer.parseInt(query)));
		criteria=getQuery(criteria, fileds);
		criteriaCount=getQuery(criteriaCount, fileds);
		List<ShareFile> list = dao.find(criteria,getStart(),getLimit());
		long count = dao.getCount(criteriaCount, new ShareFile());
		getResponse().getWriter().write(
				JsonOperate.getpageJson(count, formatToJson(list)));
	}
 	private DetachedCriteria getQuery(DetachedCriteria criteria, String[] fileds) {
		String value = "";
		String operate = "";
		for (int i = 0; i < fileds.length; i++) {
			if (null != fileds[i] && !"".equals(fileds[i])) {
				if (fileds[i].trim().equals("fileSize")) {
					operate = request.getParameter("filter[" + i
							+ "][data][comparison]");
					value = request.getParameter("filter[" + i
							+ "][data][value]");
					if (operate.trim().equals("lt")) {
						criteria.add(Restrictions.lt("fileSize", new Float(value)));
					} else if (operate.trim().equals("gt")) {
						criteria.add(Restrictions.gt("fileSize", new Float(value)));
					} else {
						criteria.add(Restrictions.eq("fileSize", new Float(value)));
					}	
				}else if (fileds[i].trim().equals("shareDate")) {
					operate = request.getParameter("filter[" + i
							+ "][data][comparison]");
					value = request.getParameter("filter[" + i
							+ "][data][value]");
					if (operate.trim().equals("lt")) {
						criteria.add(Restrictions.lt("shareDate",value));
					} else if (operate.trim().equals("gt")) {
						criteria.add(Restrictions.gt("shareDate",value));
					} else {
						criteria.add(Restrictions.like("shareDate", value,MatchMode.ANYWHERE));
					}	
				}else if (fileds[i].trim().equals("title")) {
					value = request.getParameter("filter[" + i
							+ "][data][value]");
					criteria.add(Restrictions.like("title", value,
							MatchMode.ANYWHERE));
				} else if (fileds[i].trim().equals("shareUser")) {
					value = request.getParameter("filter[" + i
							+ "][data][value]");
					criteria.add(Restrictions.like("shareUser", value,
							MatchMode.ANYWHERE));
				}else if (fileds[i].trim().equals("fileType")) {
					String[] values = request.getParameterValues("filter[" + i
							+ "][data][value]");
					List<String> list=new ArrayList<String>();
					for (int j = 0; j < values.length; j++) {
						if(values[j].equals("视频")){
							list.add(".avi");
							list.add(".rmvb");
							list.add(".mv");
							list.add(".mkv");
							list.add(".rm");
							list.add(".wmv");
							list.add(".mp4");
						}else if(values[j].equals("音乐")){
							list.add(".mp3");
						}else if(values[j].equals("图像")){
							list.add(".jpg");
							list.add(".png");
							list.add(".gif");
							list.add(".psd");
						}else if(values[j].equals("OFFICE文档")){
							list.add(".xls");
							list.add(".xlsx");
							list.add(".ppt");
							list.add(".pptx");
							list.add(".doc");
							list.add(".docx");
						}else if(values[j].equals("记事本文件")){
							list.add(".txt");
						}else if(values[j].equals("PDF")){
							list.add(".pdf");
						}else if(values[j].equals("运行文件")){
							list.add(".exe");
						}
					}
					Object[] opts = new Object[list.size()];
					for (int j = 0; j <list.size(); j++) {
						opts[j]=list.get(j);
					}
					criteria.add(Restrictions.in("fileType", opts));
				} 
				value = "";
				operate = "";
			}

		}
		return criteria;
	}
	private String formatToJson(List<ShareFile> list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (ShareFile shareFile : list) {
			sb.append("{");
			sb.append("'id':" + shareFile.getId() + ",");
			sb.append("'shareCatalogue':"
					+ shareFile.getShareCatalogue().getId() + ",");
			sb.append("'title':'" + shareFile.getTitle() + "',");
			sb.append("'fileType':'" + shareFile.getFileType() + "',");
			sb.append("'fileUrl':'" + shareFile.getFileUrl() + "',");
			sb.append("'fileSize':'" + shareFile.getFileSize() + "K',");
			sb.append("'shareDate':'" + shareFile.getShareDate() + "',");
			sb.append("'shareUser':'" + shareFile.getShareUser() + "',");
			sb.append("'shareDes':'" + shareFile.getShareDes() + "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
		return sb.toString();
	}

	public void isManager() throws Exception {
		String roleName = getCurrentUser().getRoleInfo().getRoleName();
		if (roleName.equals("管理员")) {
			getResponse().getWriter().write("true");
		} else {
			getResponse().getWriter().write("false");
		}
	}

	public void addCatalog() throws Exception {
		dao.add(catalogue);
		getResponse().getWriter().write("true");
	}

	public void deleteCatalog() throws Exception {
		dao.delete(catalogue);
		DetachedCriteria criteria=DetachedCriteria.forClass(ShareCatalogue.class);
		criteria.add(Restrictions.eq("parentId", catalogue.getId()));
		List<ShareCatalogue> list=dao.find(criteria);
		for (ShareCatalogue shareCatalogue : list) {
			dao.delete(shareCatalogue);
		}
		getResponse().getWriter().write("true");
	}

	public void updateCatalog() throws Exception {
		DetachedCriteria criteria = DetachedCriteria
				.forClass(ShareCatalogue.class);
		criteria.add(Restrictions.eq("id", catalogue.getId()));
		ShareCatalogue target = (ShareCatalogue) dao.find(criteria).get(0);
		BeanUtil.copy(catalogue, target);
		dao.update(target);
		getResponse().getWriter().write("true");
	}

	public void deleteFile() throws Exception {
		String fileName = request.getParameter("fileName");
		String path = request.getRealPath("data");
		File file = new File(path + fileName);
		if (file.exists()) {
			file.delete();
		}
		getResponse().getWriter().write("true");
	}

	public void uploadFile() {
		UserInfo user = getCurrentUser();
		double size = share.length() / 1024.00 ;
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
		try {
			Random random = new Random();
			InputStream input = new FileInputStream(share);
			String path = request.getRealPath("data");
			File file = new File(path + "/" + user.getId());
			if (!file.exists()) {
				file.mkdirs();
			}
			String abPath = "/"
					+ shareFileName.substring(0,
							shareFileName.lastIndexOf(".")) + "_"
					+ format.format(new Date()) + random.nextInt(1000000)
					+ shareFileName.substring(shareFileName.lastIndexOf("."));
			OutputStream os = new FileOutputStream(file + abPath);
			byte[] bt = new byte[1024];
			int in = 0;
			while ((in = input.read(bt)) != -1) {
				os.write(bt, 0, in);
			}
			input.close();
			os.close();
			ShareFile shareFile = new ShareFile();
			String sizeLength=size+"";
			if(sizeLength.indexOf(".")>=0&&sizeLength.substring(sizeLength.indexOf(".")).length()>2){
				sizeLength=sizeLength.substring(0,sizeLength.indexOf(".")+3);
			}
			shareFile.setFileSize(Float.parseFloat(sizeLength));
			shareFile.setFileType(shareFileName.substring(shareFileName
					.lastIndexOf(".")));
			shareFile.setFileUrl(user.getId() + abPath);
			shareFile.setShareCatalogue(catalogue);
			format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			shareFile.setShareDate(format.format(new Date()));
			shareFile.setShareDes(request.getParameter("shareDes"));
			shareFile.setTitle(shareFileName);
			shareFile.setShareUser(getCurrentUser().getUserName() + "("
					+ getCurrentUser().getId() + ")");
			dao.add(shareFile);
			String success = "{'success':true,'msg':'" + user.getId() + abPath
					+ "'}";
			getResponse().getWriter().write(success);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void getShareCatalogName() {
		DetachedCriteria criteria=DetachedCriteria.forClass(ShareCatalogue.class);
		List<ShareCatalogue> lists=dao.find(criteria);
		StringBuffer sb=new StringBuffer();
		sb.append("[");
		for (ShareCatalogue shareCatalogue : lists) {
			if(shareCatalogue.getParentId()!=null){
				sb.append("{'id':'"+shareCatalogue.getId()+"',");
				sb.append("'text':'"+shareCatalogue.getCatalogueName()+"'},");
			}
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

	private String fileName;

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) throws Exception {
		this.fileName = new String(fileName.getBytes("ISO-8859-1"), "UTF-8");
	}

	// 从下载文件原始存放路径读取得到文件输出流
	private boolean exist = true;

	public InputStream getDownloadFile() throws Exception {
		InputStream input = ServletActionContext.getServletContext()
				.getResourceAsStream("/data/" + fileName);
		if (null != input) {
			return input;
		} else {
			exist = false;
			return ServletActionContext.getServletContext()
					.getResourceAsStream("/data/" + "原文件丢失.docx");
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
			if (!exist) {
				downloadChineseFileName = "The original file is missing";
			}
		} catch (Exception e) {
		}
		return downloadChineseFileName;
	}

	public String execute() {
		return SUCCESS;
	}
   public void getShow() throws Exception{
	   DetachedCriteria criteria = DetachedCriteria.forClass(ShareFile.class);
	   DetachedCriteria criteriaCount = DetachedCriteria.forClass(ShareFile.class);
	   criteria.addOrder(Order.desc("id"));
	   List<ShareFile> list=dao.find(criteria,0,6);
	   long count = dao.getCount(criteriaCount, new ShareFile());
	   getResponse().getWriter().write(
				JsonOperate.getpageJson(count, formatToJson(list)));
   }
}

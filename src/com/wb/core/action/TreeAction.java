package com.wb.core.action;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.struts2.ServletActionContext;
import org.drools.lang.DRLExpressions.relationalOp_return;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import com.soft.core.utils.SystemConstant;
import com.wb.core.dao.RoleInfoDao;
import com.wb.core.dao.UserDao;
import com.wb.core.domain.Depart;
import com.wb.core.domain.RoleAndRight;
import com.wb.core.domain.RoleInfo;
import com.wb.core.domain.RoleRight;
import com.wb.core.domain.UserInfo;
import com.wb.core.utils.TreeCheckedModel;
import com.wb.core.utils.TreeModel;
import com.wb.core.utils.UserTreeCheckedModel;
import com.wb.core.utils.UserTreeModel;
import com.wb.share.domain.ShareCatalogue;

@Controller
@Scope("prototype")
public class TreeAction extends ActionSupport {
	private RoleInfoDao dao;

	public RoleInfoDao getDao() {
		return dao;
	}

	@Resource
	public void setDao(RoleInfoDao dao) {
		this.dao = dao;
	}

	public void getUserRight() {
		UserInfo user = (UserInfo) ActionContext.getContext().getSession().get(
				SystemConstant.CURRENT_USER);
		RoleInfo role = dao.get(user.getRoleInfo().getId());
		Set<RoleAndRight> rs = role.getRoleAndRights();
		TreeModel root = new TreeModel();
		root.setId(0);
		root.setLeaf(false);
		root.setQtitle("");
		root.setText("root");
		for (RoleAndRight roleAndRight : rs) {
			RoleRight roleright = roleAndRight.getRoleRight();
			boolean parent = roleright.getRightId() % 100 == 0 ? true : false;
			if (parent) {
				TreeModel node = new TreeModel();
				node.setId(roleright.getRightId());
				node.setQtitle(roleright.getRightUrl());
				node.setIconCls(roleright.getRightIconCls());
				node.setText(roleright.getRightName());
				node.setLeaf(false);
				root.getChildren().add(node);
			}
		}
		for (RoleAndRight roleAndRight : rs) {
			RoleRight roleright = roleAndRight.getRoleRight();
			boolean parent = roleright.getRightId() % 100 == 0 ? true : false;
			if (!parent) {
				TreeModel node = new TreeModel();
				node.setId(roleright.getRightId());
				node.setQtitle(roleright.getRightUrl());
				node.setIconCls(roleright.getRightIconCls());
				node.setText(roleright.getRightName().trim());
				node.setLeaf(true);
				for (TreeModel parentNode : root.getChildren()) {
					Collections.sort(parentNode.getChildren());
					String first = ("" + node.getId()).substring(0, 1);
					String parentFirst = ("" + parentNode.getId()).substring(0,
							1);
					if (parentFirst.equals(first)) {
						parentNode.getChildren().add(node);
					}
				}
			}
		}
		// 后台排序用不上了
		/*
		 * Collections.sort(root.getChildren()); for (TreeModel parentNode :
		 * root.getChildren()) { Collections.sort(parentNode.getChildren()); }
		 */
		Gson gson = new Gson();
		ServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html;charset=UTF-8");
		String treeStr = gson.toJson(root);
		try {
			response.getWriter().write(treeStr);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void queryRoleRight() {
		ServletRequest request = ServletActionContext.getRequest();
		String queryID = request.getParameter("roleID");
		RoleInfo userRole = dao.get(Integer.parseInt(queryID));
		RoleInfo role = dao.get(1);
		Set<RoleAndRight> rs = role.getRoleAndRights();
		TreeCheckedModel root = new TreeCheckedModel();
		root.setId(1);
		root.setLeaf(false);
		root.setQtitle("");
		root.setText("root");
		root.setChecked(true);
		for (RoleAndRight roleAndRight : rs) {
			RoleRight roleright = roleAndRight.getRoleRight();
			boolean parent = roleright.getRightId() % 100 == 0 ? true : false;
			if (parent) {
				TreeCheckedModel node = new TreeCheckedModel();
				node.setId(roleright.getRightId());
				node.setQtitle(roleright.getRightUrl());
				node.setIconCls(roleright.getRightIconCls());
				node.setText(roleright.getRightName());
				node.setLeaf(false);
				node.setExpanded(true);
				node.setChecked(roleHaveRight(userRole, roleright));
				root.getChildren().add(node);
			}
		}
		for (RoleAndRight roleAndRight : rs) {
			RoleRight roleright = roleAndRight.getRoleRight();
			boolean parent = roleright.getRightId() % 100 == 0 ? true : false;
			if (!parent) {
				TreeCheckedModel node = new TreeCheckedModel();
				node.setId(roleright.getRightId());
				node.setQtitle(roleright.getRightUrl());
				node.setIconCls(roleright.getRightIconCls());
				node.setText(roleright.getRightName().trim());
				node.setChecked(roleHaveRight(userRole, roleright));
				node.setLeaf(true);
				node.setExpanded(true);
				for (TreeCheckedModel parentNode : root.getChildren()) {
					Collections.sort(parentNode.getChildren());
					String first = ("" + node.getId()).substring(0, 1);
					String parentFirst = ("" + parentNode.getId()).substring(0,
							1);
					if (parentFirst.equals(first)) {
						parentNode.getChildren().add(node);
					}
				}
			}
		}
		Gson gson = new Gson();
		ServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html;charset=UTF-8");
		String treeStr = gson.toJson(root);
		try {
			response.getWriter().write(treeStr);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private boolean roleHaveRight(RoleInfo roleInfo, RoleRight right) {
		for (RoleAndRight rightAndright : roleInfo.getRoleAndRights()) {
			if (rightAndright.getRoleRight().getRightId() == right.getRightId()) {
				return true;
			}
		}
		return false;
	}

	public void addRoleRight() throws Exception {
		ServletRequest request = ServletActionContext.getRequest();
		request.setCharacterEncoding("UTF-8");
		String[] ids = request.getParameterValues("id");
		String roleID = request.getParameter("role");
		ServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html;charset=UTF-8");
		RoleInfo roleInfo = dao.get(Integer.parseInt(roleID));
		if(roleInfo.getId().equals(1)){
			response.getWriter().write("false");
			return;
		}
		try {
			for (RoleAndRight roleAndRight : roleInfo.getRoleAndRights()) {
				dao.delete(roleAndRight);
			}
			for (String id : ids) {
				RoleAndRight roleAndRight = new RoleAndRight();
				RoleRight right = new RoleRight();
				right.setRightId(Integer.parseInt(id));
				roleAndRight.setRoleRight(right);
				roleAndRight.setRoleInfo(roleInfo);
				dao.add(roleAndRight);
			}
			if (ids.length > 0) {
				roleInfo.setRoleHave(true);
				dao.update(roleInfo);
			} else {
				roleInfo.setRoleHave(false);
				dao.update(roleInfo);
			}
			response.getWriter().write("true");
		} catch (Exception e) {
			if(null==ids){
				roleInfo.setRoleHave(false);
				dao.update(roleInfo);
			}
			response.getWriter().write("false");
		}

	}
	public void getUserInfoTree() throws Exception{
		ServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html;charset=UTF-8");
		DetachedCriteria criteria=DetachedCriteria.forClass(UserInfo.class);
		List<UserInfo> userList=dao.find(criteria);
		DetachedCriteria criteriaDepart=DetachedCriteria.forClass(Depart.class);
		List<Depart> departList=dao.find(criteriaDepart);
		UserTreeModel root = new UserTreeModel();
		root.setLeaf(false);
		for (Depart depart : departList) {
			UserTreeModel parent=new UserTreeModel();
			parent.setDepartName(depart.getDepartName());
			parent.setLeaf(false);
			parent.setPositionName("");
			parent.setIconCls("user_manager");
			parent.setUserName(depart.getDepartName());
			root.getChildren().add(parent);
		}
		for (UserInfo user : userList) {
			UserTreeModel child=new UserTreeModel();
			child.setUserName(user.getUserName());
			child.setLeaf(true);
			child.setQtitle(user.getId()+"");
			child.setIconCls("user_gray");
			child.setDepartName(user.getDepart().getDepartName());
            child.setPositionName(user.getPosition().getPositionName());
			for(UserTreeModel node:root.getChildren()){
				if(node.getDepartName().equals(user.getDepart().getDepartName())){
					node.getChildren().add(child);
				}
			}
		}
		Gson gson=new Gson();
		String str=gson.toJson(root);
		response.getWriter().write(str);
	}
	public void setUserInfoTree() throws Exception{
	}
	public void getUserInfoCboTree() throws Exception{
		ServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html;charset=UTF-8");
		DetachedCriteria criteria=DetachedCriteria.forClass(UserInfo.class);
		List<UserInfo> userList=dao.find(criteria);
		DetachedCriteria criteriaDepart=DetachedCriteria.forClass(Depart.class);
		List<Depart> departList=dao.find(criteriaDepart);
		UserTreeCheckedModel root = new UserTreeCheckedModel();
		root.setLeaf(false);
		for (Depart depart : departList) {
			UserTreeCheckedModel parent=new UserTreeCheckedModel();
			parent.setDepartName(depart.getDepartName());
			parent.setLeaf(false);
			parent.setPositionName("");
			parent.setIconCls("user_manager");
			parent.setUserName(depart.getDepartName());
			root.getChildren().add(parent);
		}
		for (UserInfo user : userList) {
			UserTreeCheckedModel child=new UserTreeCheckedModel();
			child.setUserName(user.getUserName());
			child.setLeaf(true);
			child.setQtitle(user.getId()+"");
			child.setIconCls("user_gray");
			child.setDepartName(user.getDepart().getDepartName());
            child.setPositionName(user.getPosition().getPositionName());
			for(UserTreeCheckedModel node:root.getChildren()){
				if(node.getDepartName().equals(user.getDepart().getDepartName())){
					node.getChildren().add(child);
				}
			}
		}
		Gson gson=new Gson();
		String str=gson.toJson(root);
		response.getWriter().write(str);
	}
	public void getCatalogueInfo() throws Exception{
		ServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html;charset=UTF-8");
		DetachedCriteria criteria=DetachedCriteria.forClass(ShareCatalogue.class);
		criteria.addOrder(Order.desc("id"));
		List<ShareCatalogue> list=dao.find(criteria);
		TreeModel root = new TreeModel();
		root.setLeaf(false);
		root.setText("管理");
		for (ShareCatalogue shareCatalogue : list) {
			if(null==shareCatalogue.getParentId()){
				TreeModel parent=new TreeModel();
				parent.setId(shareCatalogue.getId());
				parent.setIconCls("");
				parent.setText(shareCatalogue.getCatalogueName());
				parent.setQtitle("");
				parent.setLeaf(false);
				root.getChildren().add(parent);
			}
		}
		for (ShareCatalogue shareCatalogue : list) {
			if(null!=shareCatalogue.getParentId()){
				TreeModel child=new TreeModel();
				child.setId(shareCatalogue.getId());
				child.setIconCls("wb_share_item");
				child.setText(shareCatalogue.getCatalogueName());
				child.setQtitle("");
				child.setLeaf(true);
				for (TreeModel parent : root.getChildren()) {
					if(shareCatalogue.getParentId().equals(parent.getId())){
						parent.getChildren().add(child);
					}
				}
			}
		}
		Gson gson=new Gson();
		String str=gson.toJson(root);
		response.getWriter().write(str);
	}
}

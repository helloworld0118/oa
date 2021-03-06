package com.wb.core.utils;

import java.util.ArrayList;
import java.util.List;

public class UserTreeCheckedModel{
	private String userName;
	private boolean leaf;
    private String departName;
    private String positionName;
    private String qtitle;
    private String iconCls;
    private boolean checked=false;
	private List<UserTreeCheckedModel> children=new ArrayList<UserTreeCheckedModel>(0);

	public List<UserTreeCheckedModel> getChildren() {
		return children;
	}

	public void setChildren(List<UserTreeCheckedModel> children) {
		this.children = children;
	}


	public boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}

	public String getDepartName() {
		return departName;
	}

	public void setDepartName(String departName) {
		this.departName = departName;
	}


	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPositionName() {
		return positionName;
	}

	public void setPositionName(String positionName) {
		this.positionName = positionName;
	}

	public String getQtitle() {
		return qtitle;
	}

	public void setQtitle(String qtitle) {
		this.qtitle = qtitle;
	}

	public String getIconCls() {
		return iconCls;
	}

	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}

	public boolean isChecked() {
		return checked;
	}

	public void setChecked(boolean checked) {
		this.checked = checked;
	}

}

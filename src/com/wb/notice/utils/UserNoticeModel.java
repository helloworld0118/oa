package com.wb.notice.utils;

import java.util.ArrayList;
import java.util.List;


public class UserNoticeModel {
	private String text;
	private String position;
	private String time;
	private String iconCls;
	private boolean expanded;
	
	private List<UserNoticeModel> children=new ArrayList<UserNoticeModel>(0);
	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getIconCls() {
		return iconCls;
	}

	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}

	public List<UserNoticeModel> getChildren() {
		return children;
	}

	public void setChildren(List<UserNoticeModel> children) {
		this.children = children;
	}

	public boolean isExpanded() {
		return expanded;
	}

	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
	}

}

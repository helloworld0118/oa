package com.wb.core.utils;

import java.util.ArrayList;
import java.util.List;

public class TreeModel implements Comparable<TreeModel>{
	private int id;
	private String text;
	private boolean leaf;
	private String qtitle;
	private String iconCls;
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


	private List<TreeModel> children=new ArrayList<TreeModel>(0);

	public List<TreeModel> getChildren() {
		return children;
	}

	public void setChildren(List<TreeModel> children) {
		this.children = children;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}

	@Override
	public int compareTo(TreeModel o) {
		return this.id-o.id;
	}

}

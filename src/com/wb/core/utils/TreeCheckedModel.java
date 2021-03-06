package com.wb.core.utils;

import java.util.ArrayList;
import java.util.List;

public class TreeCheckedModel  implements Comparable<TreeCheckedModel> {
	private int id;
	private String text;
	private boolean checked;
	private boolean leaf;
	private String qtitle;
	private String iconCls;
    private boolean expanded;
    
	public boolean isExpanded() {
		return expanded;
	}

	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
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


	private List<TreeCheckedModel> children=new ArrayList<TreeCheckedModel>(0);

	public List<TreeCheckedModel> getChildren() {
		return children;
	}

	public void setChildren(List<TreeCheckedModel> children) {
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

	public boolean isChecked() {
		return checked;
	}

	public void setChecked(boolean checked) {
		this.checked = checked;
	}

	public boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}

	@Override
	public int compareTo(TreeCheckedModel o) {
		return this.id-o.id;
	}

}

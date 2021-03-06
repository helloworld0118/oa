package com.soft.core.utils;

public class JsonOperate {
	public static String getpageJson(Long count, String strJson) {
		StringBuffer sb = new StringBuffer();
		sb.append("{");
		sb.append("'total':" + count);
		sb.append(",'items':" + strJson);
		sb.append("}");
		return sb.toString();
	}
}

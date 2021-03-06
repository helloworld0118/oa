package com.soft.process.action;

import java.io.File;
import java.io.FileInputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.annotation.Resource;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.query.Query;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.apache.commons.io.FilenameUtils;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.soft.core.action.AbstractAction;
import com.soft.core.utils.JsonOperate;
import com.soft.process.domain.ProcessDefinitionModel;

@Controller
@Scope("prototype")
public class ProcessDefinitionAction extends AbstractAction {

	private static final long serialVersionUID = 1L;

	private RepositoryService repositoryService;

	private File process;
	private String processFileName;

	/**
	 * 查询条件
	 */

	@Resource
	public void setRepositoryService(RepositoryService repositoryService) {
		this.repositoryService = repositoryService;
	}

	public void getAll() throws Exception {
		Query query = createQuery();
		long total = query.count();
		List<ProcessDefinition> list=query.listPage(start, limit);
		getResponse().getWriter().write(JsonOperate.getpageJson(total, getListGson(list)));
	}
    public String getListGson(List<ProcessDefinition> list){
    	StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (ProcessDefinition processDefinition : list) {
			sb.append("{");
			sb.append("'id':'" + processDefinition.getId() + "',");
			sb.append("'name':'" + processDefinition.getName() + "',");
			sb.append("'deploymentId':'" + processDefinition.getDeploymentId() + "',");
			sb.append("'version':'" + processDefinition.getVersion() + "',");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
    	return sb.toString();
    }
	/*
	 * 产生query 处理条件
	 */
	public Query createQuery() {
		ProcessDefinitionQuery query = repositoryService
				.createProcessDefinitionQuery();
		// 查询条件
		if (null != getQuery() && !"".equals(getQuery().trim())) {
			query.processDefinitionNameLike(getQuery());
		}
		return query;
	}

	/*
	 * 删除
	 */
	public void doDelete(String id) {
		repositoryService.deleteDeployment(id, true);
	}

	public String toDeploy() {
		return "deploy";
	}
    public void delete(){
    	String json = request.getParameter("data");
		Gson gson = new Gson();
		try {
			List<ProcessDefinitionModel> list = gson.fromJson(json,
					new TypeToken<List<ProcessDefinitionModel>>() {
					}.getType());
			for (ProcessDefinitionModel processDefinitionModel : list) {
				doDelete(processDefinitionModel.getDeploymentId());
			}
		} catch (Exception e) {
			try {
				ProcessDefinitionModel processDefinitionModel = gson.fromJson(json, ProcessDefinitionModel.class);
				doDelete(processDefinitionModel.getDeploymentId());
			} catch (Exception e2) {
			}
		}
    }
	public void deploy() throws Exception {
		ZipInputStream in = new ZipInputStream(new FileInputStream(process));
		ZipEntry entry = null;
		while ((entry = in.getNextEntry()) != null) {
			if (!entry.isDirectory()) {
				String extension = FilenameUtils.getExtension(entry.getName())
						.toLowerCase();
				if ("xml".equals(extension)) {
					repositoryService.createDeployment().addInputStream(
							entry.getName(), in).deploy();
				}
			}
			in.closeEntry();
		}
		in.close();
		getResponse().getWriter().write("{'success':true}");
	}

	public void setProcess(File process) {
		this.process = process;
	}

	public void setProcessFileName(String processFileName) {
		this.processFileName = processFileName;
	}

}

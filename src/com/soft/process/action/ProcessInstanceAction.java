package com.soft.process.action;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.impl.RepositoryServiceImpl;
import org.activiti.engine.impl.bpmn.diagram.ProcessDiagramGenerator;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.process.TransitionImpl;
import org.activiti.engine.query.Query;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.runtime.ProcessInstanceQuery;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;

import com.soft.core.action.AbstractAction;
import com.soft.process.utils.ActiviDiagram;

@Controller
@Scope("prototype")
public class ProcessInstanceAction extends ProcessBaseAction {

	private static final long serialVersionUID = 1L;

	private RuntimeService runtimeService;
	private RepositoryServiceImpl repositoryService;
	private HistoryService historyService;

	/**
	 * 流程实例的Id
	 */
	private String id;
	private String definitionId;
	@Resource
	public void setRuntimeService(RuntimeService runtimeService) {
		this.runtimeService = runtimeService;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Resource
	public void setRepositoryService(RepositoryServiceImpl repositoryService) {
		this.repositoryService = repositoryService;
	}

	@Resource
	public void setHistoryService(HistoryService historyService) {
		this.historyService = historyService;
	}

	public void setDefinitionId(String definitionId) {
		this.definitionId = definitionId;
	}
	public Query createQuery() {
		ProcessInstanceQuery query = runtimeService
				.createProcessInstanceQuery();
		if (null != getQuery() && !"".equals(getQuery().trim())) {
			query.processDefinitionKey(getQuery());
		}

		return query;
	}

	public void picture() throws Exception {
		if (null != definitionId && !"".equals(definitionId.trim())) {
			definitionKey = repositoryService.createProcessDefinitionQuery()
					.processDefinitionId(definitionId).singleResult().getKey();
		}
		ProcessInstance processInstance = runtimeService
				.createProcessInstanceQuery().processInstanceBusinessKey(id,
						definitionKey).singleResult();
		ProcessDefinitionEntity pde = (ProcessDefinitionEntity) repositoryService
				.getDeployedProcessDefinition(processInstance
						.getProcessDefinitionId());
		List<Execution> executions = runtimeService.createExecutionQuery()
				.processInstanceId(processInstance.getId()).list();
		// 正在活动的activity的id
		List<String> activeIds = new ArrayList<String>();
		for (Execution exe : executions) {
			List<String> list = runtimeService
					.getActiveActivityIds(exe.getId());
			activeIds.addAll(list);
		}
		// 结束的activity的id
		List<HistoricActivityInstance> historicActivityInstances = historyService
				.createHistoricActivityInstanceQuery().finished()
				.processInstanceId(processInstance.getId()).list();
		List<String> historyIds = new ArrayList<String>();
		for (HistoricActivityInstance historicActivityInstance : historicActivityInstances) {
			if (historicActivityInstance.getEndTime() != null
					&& !historicActivityInstance.getActivityType().equals(
							"startEvent")
					&& !(historicActivityInstance.getActivityType().indexOf(
							"Gateway") >= 0)) {
				historyIds.add(historicActivityInstance.getActivityId());
			}
		}
		historyIds.removeAll(activeIds);
		try {
			InputStream in = ActiviDiagram.generateDiagram(pde, "png", activeIds,
					historyIds);
			FileCopyUtils.copy(in, response.getOutputStream());
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
}

package com.soft.process.action;

import java.util.List;

import javax.annotation.Resource;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.query.Query;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ActionContext;
import com.soft.core.action.AbstractAction;

public abstract class ProcessBaseAction extends AbstractAction {

	/**
	 * 查询条件
	 */
	protected String definitionKey;
	
	protected Query createQuery() {
		return null;
	}
	public String getDefinitionKey() {
		return definitionKey;
	}

	public void setDefinitionKey(String definitionKey) {
		this.definitionKey = definitionKey;
	}

}

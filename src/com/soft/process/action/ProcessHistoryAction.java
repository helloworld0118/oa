package com.soft.process.action;

import java.util.List;

import javax.annotation.Resource;

import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricProcessInstanceQuery;
import org.activiti.engine.query.Query;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.soft.core.utils.JsonOperate;


@Controller
@Scope("prototype")
public class ProcessHistoryAction extends ProcessBaseAction {

	private static final long serialVersionUID = 1L;
	
	private HistoryService historyService;
	private RepositoryService repositoryService;
	@Resource
	public void setRepositoryService(RepositoryService repositoryService) {
		this.repositoryService = repositoryService;
	}
	@Resource
	public void setHistoryService(HistoryService historyService) {
		this.historyService = historyService;
	}
	public void getAll() throws Exception {
		Query query = createQuery();
		long total = query.count();
		List<HistoricProcessInstance> list=query.listPage(start, limit);
		getResponse().getWriter().write(JsonOperate.getpageJson(total, getListGson(list)));
	}
    public String getListGson(List<HistoricProcessInstance> list){
    	StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (HistoricProcessInstance history : list) {
			sb.append("{");
			sb.append("'id':'" + history.getId() + "',");
			sb.append("'startTime':'" + history.getStartTime() + "',");
			sb.append("'duration':'" + (history.getDurationInMillis()/1000.0/60.0)+ "'");
			sb.append("},");
		}
		if (list.size() > 0) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]");
    	return sb.toString();
    }
	@Override
	public Query createQuery() {
		HistoricProcessInstanceQuery query = historyService.createHistoricProcessInstanceQuery();
		query = query.finished();
		if (null != getQuery() && !"".equals(getQuery().trim())) {
			query.processDefinitionKey(getQuery());
		}
		return query;
	}
	
	public void doDelete(String id) {
		historyService.deleteHistoricProcessInstance(id);
	}
	
}

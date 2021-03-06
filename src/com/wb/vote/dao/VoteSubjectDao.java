package com.wb.vote.dao;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.soft.core.dao.GenericDao;
import com.wb.vote.domain.VoteSubject;
import com.wb.vote.utils.ChartModel;

@Repository
public class VoteSubjectDao extends GenericDao<VoteSubject>{
	public List<ChartModel> getVoteCount(VoteSubject subject){
		String sql="SELECT COUNT(vi_id) AS count,vote_option.vo_option AS name FROM vote_item,vote_subject,vote_option WHERE vote_item.vo_id=vote_option.vo_id AND vote_item.vs_id=vote_subject.vs_id AND vote_subject.vs_id="+subject.getVsId()+"  GROUP BY vote_item.vo_id";
		List<Object[]> list=sessionFactory.getCurrentSession().createSQLQuery(sql).list();
		List<ChartModel> results=new ArrayList<ChartModel>();
		for (Object[] objects : list) {
			ChartModel chartModel=new ChartModel();
			chartModel.setCount(Integer.parseInt(objects[0].toString()));
			chartModel.setName(objects[1].toString());
			results.add(chartModel);
		}
		return results;
	}
}

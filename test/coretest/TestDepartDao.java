package coretest;
import java.util.List;

import org.hibernate.criterion.DetachedCriteria;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.wb.core.dao.DepartDao;
import com.wb.core.domain.Depart;

public class TestDepartDao {
	@Test
	public void test() {
		ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext(
				"spring/applicationContext*.xml");
		DetachedCriteria criteria = DetachedCriteria.forClass(Depart.class);
		DepartDao dao = ac.getBean(DepartDao.class);
		List<Depart> lists = dao.find(criteria);
		//Long count = dao.getCount(new Depart());
		Gson gson = new Gson();
		String departJson = gson.toJson(lists);

		StringBuffer sb = new StringBuffer();

		System.out.println(sb.toString());
	}

	
	public void test2() {
		String json = "{'id':6,'departName':'\u5de5','departDes':'  \u57fa'}";
		Gson gson = new Gson();
		try {
			List<Depart> list = gson.fromJson(json, new TypeToken<List<Depart>>(){}.getType());
			for (Depart depart : list) {
				System.out.println(depart.getId());
			}
		} catch (Exception e) {
			Depart depart=gson.fromJson(json, Depart.class);
			System.out.println(depart.getId());
		}
	}
}

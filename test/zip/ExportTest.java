package zip;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.hibernate.criterion.DetachedCriteria;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.wb.attendance.dao.WorkCensusDao;
import com.wb.attendance.utils.ExportExcel;
import com.wb.attendance.utils.WorkCensusModel;
import com.wb.core.domain.UserInfo;

public class ExportTest {
	@Test
	public void export() throws Exception {
		ClassPathXmlApplicationContext ac = new ClassPathXmlApplicationContext(
				"spring/applicationContext*.xml");
		WorkCensusDao dao=ac.getBean(WorkCensusDao.class);
		ExportExcel exportExcel=ac.getBean(ExportExcel.class);
		DetachedCriteria criteria = DetachedCriteria.forClass(UserInfo.class);
		List<WorkCensusModel> list=	dao.getList("1992-12-12", "2013-12-12", criteria, 0, 20);
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
		Random random=new Random();
		String path="H:/"+format.format(new Date())+random.nextInt(1000000);	
		exportExcel.exportExc(list, path,"1992-12-12", "2013-12-12",null);
	}

}

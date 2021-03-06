package zip;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.io.FilenameUtils;

public class ZipTest {
	
	public static void main(String[] args) throws Exception {
		SimpleDateFormat format=new SimpleDateFormat("yyyy-MM-dd/HH:mm:ss");
		System.out.println(format.format(new Date()));
	}

}

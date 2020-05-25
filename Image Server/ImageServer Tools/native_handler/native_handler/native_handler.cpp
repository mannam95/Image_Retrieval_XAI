// native_handler.cpp : Defines the exported functions for the DLL application.
//
#include "bovw_native_handler.h"

#include <opencv2/opencv.hpp>
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/xfeatures2d.hpp>
#include <opencv2/ml/ml.hpp>
#include <opencv2\features2d.hpp>
#include <opencv2\core\types_c.h>
#include <opencv2\imgproc\imgproc_c.h>

using namespace std;
using namespace cv;
using namespace cv::ml;

Mat getDataVector(Mat descriptors, Mat kCenters,int dict_size) {
	BFMatcher matcher;
	vector<DMatch> matches;
	matcher.match(descriptors, kCenters, matches);

	//Make a Histogram of visual words
	Mat datai = Mat::zeros(1, dict_size, CV_32F);
	int index = 0;
	for (auto j = matches.begin(); j < matches.end(); j++, index++) {
		datai.at<float>(0, matches.at(index).trainIdx) = datai.at<float>(0, matches.at(index).trainIdx) + 1;
	}
	return datai;
}


JNIEXPORT jfloatArray JNICALL Java_bovw_native_1handler_getDatahistogram(JNIEnv *env, jclass cls, jlong center, jlong descriptor, jint dict_size)
{
	Mat datai = getDataVector(*(Mat *)descriptor, *(Mat *)center, dict_size);
	float *arr = (float *)datai.data;

	jfloatArray ret = env->NewFloatArray( dict_size);
	env->SetFloatArrayRegion(ret, 0, dict_size, arr);
	return ret;
}
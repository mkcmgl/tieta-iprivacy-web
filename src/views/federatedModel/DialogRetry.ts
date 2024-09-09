// import store from '@/store/store';
import { ElMessageBox } from 'element-plus';
import { rerunJob } from '@/api/fateboard';
export default function open(parameter?: any, after?: any) {
  return ElMessageBox.confirm(
    `任务将从结束处继续，更新作业状态可能需要几秒钟时间.`,
    `重试`,
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      console.log(parameter);
      // rerunJob
     
    })
    .catch(() => {});
}

#### To count number of violations in quizplanet-client/web
     find  ~/Projects/quizplanet-client/web/ -name "*.ts" | grep -v node_modules | xargs ./mylint.ts 2>&1 1>/dev/null  | wc -l
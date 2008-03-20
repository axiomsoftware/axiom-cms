rm  ./cms-enterprise.zip
rm  ./cms-workgroup.zip
rm  ./cms-standard.zip

/usr/local/bin/ruby cms-build.rb

zip -r cms-enterprise cms-enterprise
zip -r cms-workgroup cms-workgroup
zip -r cms-standard cms-standard

mkdir svn-cms-enterprise
mkdir svn-cms-workgroup
mkdir svn-cms-standard

svn co svn+ssh://tmayfield@file.axiomstack.com/opt/svn/svnrepos/dev/build/cms/3.1/enterprise/ svn-cms-enterprise
svn co svn+ssh://tmayfield@file.axiomstack.com/opt/svn/svnrepos/dev/build/cms/3.1/workgroup/ svn-cms-workgroup
svn co svn+ssh://tmayfield@file.axiomstack.com/opt/svn/svnrepos/dev/build/cms/3.1/standard/ svn-cms-standard

rsync --exclude=".svn" --delete -avr cms-enterprise/* svn-cms-enterprise
rsync --exclude=".svn" --delete -avr cms-workgroup/* svn-cms-workgroup
rsync --exclude=".svn" --delete -avr cms-standard/* svn-cms-standard

find ./svn-cms-enterprise -name ".svn" -prune -o -exec svn add {} \;
find ./svn-cms-workgroup -name ".svn" -prune -o -exec svn add {} \;
find ./svn-cms-standard -name ".svn" -prune -o -exec svn add {} \;

svn commit svn-cms-enterprise -m  "Automatic Bamboo Commit **i AXSTK-253"
svn commit svn-cms-workgroup -m  "Automatic Bamboo Commit **i AXSTK-253"
svn commit svn-cms-standard -m "Automatic Bamboo Commit **i AXSTK-253"

rm -rf svn-cms-*
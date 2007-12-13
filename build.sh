rm  ./cms-enterprise.zip
rm  ./cms-professional.zip
rm  ./cms-standard.zip

/usr/local/bin/ruby cms-build.rb

zip -r cms-enterprise cms-enterprise
zip -r cms-professional cms-professional
zip -r cms-standard cms-standard

mkdir svn-cms-enterprise
mkdir svn-cms-professional
mkdir svn-cms-standard

svn co svn+ssh://tmayfield@file.axiomstack.com/opt/svn/svnrepos/dev/build/cms/3.1/enterprise/ svn-cms-enterprise
svn co svn+ssh://tmayfield@file.axiomstack.com/opt/svn/svnrepos/dev/build/cms/3.1/professional/ svn-cms-professional
svn co svn+ssh://tmayfield@file.axiomstack.com/opt/svn/svnrepos/dev/build/cms/3.1/standard/ svn-cms-standard

rsync --exclude=".svn" --delete -avr cms-enterprise/* svn-cms-enterprise
rsync --exclude=".svn" --delete -avr cms-professional/* svn-cms-professional
rsync --exclude=".svn" --delete -avr cms-standard/* svn-cms-standard

svn add svn-cms-enterprise/*
svn add svn-cms-professional/*
svn add svn-cms-standard/*

svn commit svn-cms-enterprise -m  "Automatic Bamboo Commit **i AXSTK-253"
svn commit svn-cms-professional -m  "Automatic Bamboo Commit **i AXSTK-253"
svn commit svn-cms-standard -m "Automatic Bamboo Commit **i AXSTK-253"

rm -rf svn-cms-*
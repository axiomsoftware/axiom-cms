#!/bin/bash
echo "running cms build"
cd /opt/bzr/cms-trunk

/usr/local/bin/bzr update
/usr/local/bin/ruby cms-build.rb

/usr/local/bin/rsync --exclude="./usr/local/bin/bzr" --delete -avr cms-enterprise/* ../cms-enterprise-build
/usr/local/bin/rsync --exclude="./usr/local/bin/bzr" --delete -avr cms-standard/* ../cms-standard-build

# if [ -e .lastrev ] ; then
# 	LASTREV=`cat .lastrev`
# else
# 	LASTREV=1
# fi
# /usr/local/bin/bzr revno > .lastrev

# CHANGES=`/usr/local/bin/bzr log -r $LASTREV..`
# echo $CHANGES
cd ../cms-enterprise-build
/usr/local/bin/bzr add
#/usr/local/bin/bzr commit -m "$CHANGES"
/usr/local/bin/bzr commit -m "cms autobuild"
cd ../cms-standard-build
/usr/local/bin/bzr add
/usr/local/bin/bzr commit -m "cms autobuild" 
#/usr/local/bin/bzr commit -m "$CHANGES" 

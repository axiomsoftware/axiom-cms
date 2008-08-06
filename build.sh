#!/bin/bash
cd /opt/bzr/cms-trunk
bzr update
ruby cms-build.rb

rsync --exclude=".bzr" --delete -avr cms-enterprise/* ../cms-enterprise-build
rsync --exclude=".bzr" --delete -avr cms-standard/* ../cms-standard-build

# if [ -e .lastrev ] ; then
# 	LASTREV=`cat .lastrev`
# else
# 	LASTREV=1
# fi
# bzr revno > .lastrev

# CHANGES=`bzr log -r $LASTREV..`
# echo $CHANGES
cd ../cms-enterprise-build
bzr add
#bzr commit -m "$CHANGES"
bzr commit -m "cms autobuild"
cd ../cms-standard-build
bzr add
bzr commit -m "cms autobuild" 
#bzr commit -m "$CHANGES" 

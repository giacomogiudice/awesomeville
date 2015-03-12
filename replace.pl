#!/usr/bin/perl -w
# Created by Giacomo Giudice
# The first argument is the file with the substitutions 
# separated by commas. For example:
#      foo,bar
# The second argument is the file where the substitutions 
# will be applied, by default the new text will be sent to stdout

use strict;

my $f;
my $one;
my $two;
my @orig;
my @new;
open($f, $ARGV[0]) or die "Could not open $ARGV[0]";
while(<$f>) {
    chomp($_);
    ($one, $two) = split(',',$_);
    push (@orig,$one);
    push (@new,$two);
}

open($f, $ARGV[1]) or die "Could not open $ARGV[1]";
while(my $row = <$f>) {
    chomp($row);
    foreach my $i (0 .. $#orig) {
        $row =~ s/$orig[$i]/$new[$i]/g;
    }
    print "$row\n";
}

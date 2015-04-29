import play.PlayScala

scalaVersion := "2.11.4"

name := """youtube"""

organization := """com.yetu"""

resolvers := ("Atlassian Releases" at "https://maven.atlassian.com/public/") +: resolvers.value

resolvers += Resolver.sonatypeRepo("snapshots")

bintrayResolverSettings

resolvers += bintray.Opts.resolver.mavenRepo("yetu")

val yetuPlayAuthenticatorVersion = "0.1.9"

libraryDependencies ++= Seq(
  "com.mohiva" %% "play-silhouette-testkit" % "2.0-RC1" % "test",
  "com.yetu" %% "yetu-play-authenticator" % yetuPlayAuthenticatorVersion,
  "com.yetu" %% "yetu-play-authenticator" % yetuPlayAuthenticatorVersion % "test" classifier "tests",
  "org.scalatest" %% "scalatest" % "2.2.1" % "test",
  "org.scalatestplus"  %% "play"  % "1.2.0" % "test",
  cache
)

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalacOptions ++= Seq(
  "-deprecation", // Emit warning and location for usages of deprecated APIs.
  "-feature", // Emit warning and location for usages of features that should be imported explicitly.
  "-unchecked", // Enable additional warnings where generated code depends on assumptions.
  "-Xfatal-warnings", // Fail the compilation if there are any warnings.
  "-Xlint", // Enable recommended additional warnings.
  "-Ywarn-adapted-args", // Warn if an argument list is modified to match the receiver.
  "-Ywarn-dead-code", // Warn when dead code is identified.
  "-Ywarn-inaccessible", // Warn about inaccessible types in method signatures.
  "-Ywarn-nullary-override", // Warn when non-nullary overrides nullary, e.g. def foo() over def foo.
  "-Ywarn-numeric-widen", // Warn when numerics are widened.
  "-language:implicitConversions" //allow implicit convertions defined by implicit def convertAtoB(a:A):B type functions
)

---
layout: layout.njk
title: Profiling
eleventyNavigation:
  key: features-profiling
  title: 📈 Profiling
  order: 10
---

## Application profiling

CPU profiling or sampling profiling generates a profile which tracks execution of JavaScript during the build, and can be used to identify parts of the codebase and where time was spent in it during the build. Application profiling is a higher level profile, that tracks specific phases of Parcel's execution, and which plugins were called into, and how long is spent in each.

A Parcel application profile can help you to optimize your build by answering questions such as, "Which plugin is taking the most time during my build?" or "Which file in my project takes the longest to transform?". These questions are not as easy to answer with the data provided by a CPU sampling profile, but can be answered with a Parcel application profile.

The overhead of running an application profile is relatively minimal, but is non-zero - it's certainly less expensive than running a sampling profile during the build. In particular, the JSON file produced can be quite large depending on the numbers of plugins you are using and the size of your build. Consider these factors when deciding when to enable application profiling.

### Usage

#### CLI

To generate an application profile with the CLI, start Parcel with the `--profile-application` CLI argument. Parcel will generate an [application profile JSON](#format) file in the root of your project. Parcel will log the filename it is writing the profile to when the build starts.

#### API

To generate an application profile when using the API, you must pass `shouldProfileApplication: true` with the Parcel options in order to enable the application profiling events. In addition, you will need to add the application profile reporter via `additionalReporters` to have Parcel create the profile JSON file. For example:

```js
{
    // options
    additionalReporters: [{
      packageName: '@parcel/reporter-application-profiler',
      resolveFrom: __dirname,
    }],
}
```

### Format

This file uses the [Chrome Tracing Format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview), similar to CPU profiles, but analysing it is a little bit different.

The Parcel application profile consists only of type `X` Complete Events. The raw events look like this:

```json
{"ts":6020131,"pid":11738,"tid":4,"ph":"X","name":"@parcel/transformer-js","cat":"transform","args":{"name":"src/index.html"},"dur":11642},
```

### Analysing application profiles

While you can load a Parcel application profile into Chrome Dev Tools, the analysis options for this kind of profile in that tool is fairly limited. This is because the data is not typical data that Dev Tools is designed for. The application profile events, for example, contain metadata that can be useful for deeper analysis and this metadata is not accessible through Dev Tools. In addition, a medium to large sized build may produce a volume of data that is not feasible to load into Chrome Dev Tools due to it's size.

The recommended tool for analysing Parcel application profiles is [Perfetto](https://ui.perfetto.dev/), which is also built by Google, but specifically designed for dealing with large traces, and non-browser traces. In particular, the most useful part of Perfetto for analysing these traces is that it loads the data into an [SQLite](https://www.sqlite.org/index.html) database that can be queried via the UI - this allows us to answer the kinds of questions that were mentioned earlier.

#### Example queries

Here are some example queries you can enter into the "Query (SQL)" function in Perfetto to generate some useful statistics about your Parcel builds. Keep in mind that the durations in these results are total sampled time - given Parcel's multi-threaded implementation, some of these total times will exceed the wall time of your Parcel build.

##### What is the breakdown of my build by phase?

This is a high level query that provides a breakdown by the main phases of your build - building, bundling, packaging - and can help to identify at a high level if any particular phase stands out as taking longer than expected.

```sql
select
  name, SUM(CAST(dur AS double)/1000/1000) as dur_ms
from
  slice s
where
  s.category = "Core"
group by name
order by dur_ms desc
```

##### What are the plugins in my build that take the most time?

This can be useful to identify at a high level which plugins Parcel spends the most time in. While some of these are going to be core plugins, in a build where you are using custom plugins, or other third-party plugins, this can be a useful query to identify if any of these plugins stand out as taking an unexpected amount of time - which can be useful for identifying optimisation opportunities.

```sql
select
  s.category, name, SUM(CAST(dur AS double)/1000/1000) as dur_ms
from
  slice s
left join
  args using(arg_set_id)
where
  args.flat_key = "args.name"
group by s.category, name
order by dur_ms desc
```

##### Which Babel plugins are ones are taking the most time in my build?

This can be useful to identify which Babel plugins that are still needed in your build, and executed by `@parcel/transform-babel`, take the most time and so can be prioritised to be removed or replaced with Parcel transforms.

```sql
select
  name, SUM(CAST(dur AS double)/1000/1000) as dur_ms
from
  slice s
left join
  args using(arg_set_id)
where
  args.flat_key = "args.name" AND
  s.category LIKE "transform:@parcel/transformer-babel%"
group by name
order by dur_ms desc
```

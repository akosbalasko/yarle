# test-imageWithoutSrc

Transaction Management & Scope
==============================

Other challenges lie in transaction management. Centralised (monolithic) applications, with more localised interactions, can better leverage database transaction scope; i.e. one transaction manages a series of database interactions, and still support relatively simple rollback and commit facilities.
Microservices, are more isolated, and often use different database technologies. Thus, transaction scope is isolated to the microservice-level; transactions are not shared. This leads to data consistency, and rollback challenges. Another practice must be used to orchestrate transactions. See Figure 10.

![0-RuK5Uc39KyMAOkxr.jpg](./_resources/test-imageWithoutSrc.resources/0-RuK5Uc39KyMAOkxr.jpg)

Figure 10 — transactional scope; monolith vs microservices

In the first scenario, typical of a monolith, one transaction (Tx A) manages all five database interactions, often into the same (monolithic) database schema. The second case, used in microservices, is quite different. In this case, a transaction is managed per action (assuming each database interaction is encapsulated by a single microservice interaction). This is fine if all transactions succeed, but challenging when part of the flow fails and remedial action is required.

Uniformity
==========

If not carefully managed, microservices’ evolutionary benefit can also become a hindrance.
Being ultimately flexible in technological choice (Technology Choice per Microservice), runs the risk of such diversity that it may hamper change. For instance, if the implementation (and database) technology may be anything, there is a risk that the overall solution is so technologically diverse (i.e. a complex ecosystem) that (a) comprehension can be hard, (b) security concerns are spread over a wider range of technologies, and (c) moving technical staff across domains is difficult (e.g. Simon may be an extremely competent Java developer, but he has no skills in node.js).
This uniformity is also useful for the non-functional aspects used for logging, alerting, monitoring, or any other metric-gathering tools. We don’t (particularly) want multiple ways of processing these actions (regardless of implementation technology).
There’s also something to be said from a container security perspective. By limiting the number of technologies, we should be able to more quickly patch a container, and then re-release the microservice on top of it. Patching multiple divergent technology stacks can be tougher, and suggests a higher likelihood that we must wait upon the vendor to release a patch.
Promoting a level of uniformity is therefore sensible. Better to select a limited technology set for most cases, than an unmanageable technology sprawl.

Performance
===========

Because each microservice interaction is independent (including their transactions), any significant collaboration (i.e. a workflow involving many parties), can create performance challenges. Specifically, this relates to latency (the time it takes from the initiation of an action, to receiving a response). See Figure 11.

![0-1o3tk4QQCG15z1iT.jpg](./_resources/test-imageWithoutSrc.resources/0-1o3tk4QQCG15z1iT.jpg)

Figure 11 — performance (latency) with microservices

No science was harmed in the making of this diagram! It’s merely meant to demonstrate the difference challenges for the architectural styles.
The scenario represents a distributed (e.g. microservices) system. The workflow interacts with four different domains (1, 2, 3, and 4) to complete a job. The useful functional value (white, numbered boxes) may be of a relatively short duration, whilst the red bar represents the varying latency costs of network negotiation/transfer/marshalling to talk with the next microservice. The orange bar represents the overall time cost so far. There’s quite a bit of red involved in these distributed interactions.
In Figure 12 we have a centralised representation.

![0-x2glWzxpcQ0qselE.jpg](./_resources/test-imageWithoutSrc.resources/0-x2glWzxpcQ0qselE.jpg)

Figure 12 — monolith latency

In this case, the workflow must interact with the same four services/domains, but the cost to communicate with each component is much less (i.e. the short red bars).

> Note — Tactics to Reduce Latency Woes
> There’s a few tactics that can mitigate these latency issues, but no real definitive solution. You can:
> 1\. Attempt to bring dependents closer together in the network, thus reducing latency.
> 2\. Use an orchestration mechanism that sends messages to each, and compiles a response as they become available (assuming you can do this).
> 3\. Go entirely asynchronous.
> 4\. If visual representation, provide data in stages, using technologies like Ajax.

In the end, it depends upon the system. Most technologists I know would favor scalability over performance; i.e. ensure the system can scale to meet greater demands, at the (willing) cost of slightly reduced performance.

* * *

...

Business & Technical Qualities
==============================

Microservices can (under the right conditions) promote the following qualities.

![1-hXijdOBpM6U6PbIAPaFNlQ@2x.jpeg](./_resources/test-imageWithoutSrc.resources/1-hXijdOBpM6U6PbIAPaFNlQ@2x.jpeg)

Some of my qualifications may not be obvious at the moment (e.g. how can scalability support TTM?); however, this will make more sense in future publications.

    Created at: 2020-01-13T18:38:07+00:00
    Updated at: 2020-08-30T18:46:33+01:00
    Source URL: https://medium.com/@nmckinnonblog/microservices-42b09caeb73d


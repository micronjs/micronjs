# ParticleSystem : Pool

<span class="label label-info">Class</span>

The ParticleSystem is the class controlling a bunch of particles: it decides how, when and how many particles spawn. 
Actually, that's you.
As you see, the ParticleSystem is a Pool object, in order to reuse the same particles as much as possible.
**IMPORTANT**: remember adding a base object to pool (_addToPool_) BEFORE spawning. Just like any other pool.
					
## Methods

    constructor ()

---

    spawn (x, y, amount)
